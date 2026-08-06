#!/usr/bin/env python3
"""Coach Steve Film Room — live playlist API (port 8000).

Serves fresh, normalized video data for both YouTube playlists.

Data sources, in order:
1. Connected YouTube account via the `external-tool` CLI (available in the
   development/preview sandbox — richest metadata).
2. Direct public playlist extraction with yt-dlp (works in the published
   production sandbox, no account needed).
3. Bundled snapshot (snapshot.json) as a last resort.

Results are cached in memory for 15 minutes; if every refresh path fails,
the last good data (or the snapshot) is served.
"""
import json
import os
import re
import subprocess
import threading
import time

CAGE_PLAYLIST = "PLf-AYFJb_UQ0"
GAME_PLAYLIST = "PLOJLN7PMUYVg"
OWN_CHANNEL = "Coach Steve Baseball"
CACHE_TTL = 15 * 60  # seconds
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SNAPSHOT_PATH = os.path.join(BASE_DIR, "snapshot.json")

PLAYERS = {
    "Gavin": ["gavin"],
    "SeanM": ["sean mack"],
    "SeanJ": ["sean j"],
    "Sean": ["sean"],
    "Gunnar": ["gunnar", "gunner"],
    "Sam": ["samuel vargas", "sam walking", "sam "],
    "Nathan": ["nathan"],
    "Emmett": ["emmet"],
    "Jaden": ["jaden"],
    "Jack": ["jack before", "jack "],
    "Joe": ["joe overlooked", "joe went", "joe "],
    "Antonio": ["antonio"],
}

RESULTS = {
    "HqMqTy4dq90": "2-RBI single",
    "SmT1JeBoSdw": "Base knock",
    "mGD6R_hpnCk": "Last to 5th in the lineup",
    "zBwEEfyYjFs": "Perfect Game double",
    "-TFKGUzqoYA": "5-for-6 · 3B + 2B",
    "ZhEy9ZP47YQ": "2-run home run",
    "yOE1ou4xIpM": "6 AB · 4 H · 6 RBI",
    "7B0P1wyjkyA": "No-doubt home run",
    "-O6pUAk8LqI": "2-strike battle won",
    "LjUwZwk78Xw": "2-0 count, punished",
}
RESULT_KEYWORDS = [
    (r"grand slam", "Grand slam"),
    (r"walk[- ]?off", "Walk-off"),
    (r"home run|\bhr\b|homer", "Home run"),
    (r"triple\b", "Triple"),
    (r"double\b", "Double"),
    (r"single\b", "Single"),
    (r"\brbi\b", "RBI"),
    (r"\bhits?\b", "Base hit"),
]


def tag_players(title, desc):
    t = (title + " " + desc).lower()
    tags = []
    for name, keys in PLAYERS.items():
        if any(k in t for k in keys):
            tags.append(name)
    out = []
    for x in tags:
        d = "Sean" if x.startswith("Sean") else x
        if d not in out:
            out.append(d)
    return out


def result_label(video_id, title):
    if video_id in RESULTS:
        return RESULTS[video_id]
    t = title.lower()
    for pattern, label in RESULT_KEYWORDS:
        if re.search(pattern, t):
            return label
    return ""


def load_snapshot():
    try:
        with open(SNAPSHOT_PATH) as f:
            return json.load(f)
    except Exception:
        return {"cage": [], "game": []}


SNAPSHOT = load_snapshot()
SNAPSHOT_META = {
    v["id"]: v for key in ("cage", "game") for v in SNAPSHOT.get(key, [])
}


# ---------- Source 1: connected YouTube account (dev sandbox) ----------
def fetch_connector(playlist_id):
    proc = subprocess.run(
        [
            "external-tool",
            "call",
            json.dumps(
                {
                    "source_id": "youtube_data_api__pipedream",
                    "tool_name": "youtube_data_api-list-playlist-videos",
                    "arguments": {"playlistId": playlist_id, "maxResults": 50},
                }
            ),
        ],
        capture_output=True,
        timeout=60,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode()[:300])
    items = json.loads(proc.stdout.decode())
    if isinstance(items, dict):
        items = items.get("result") or items.get("items") or []
    out = []
    for it in items:
        s = it.get("snippet", {})
        cd = it.get("contentDetails", {})
        vid = cd.get("videoId") or s.get("resourceId", {}).get("videoId")
        title = (s.get("title") or "").strip()
        if not vid or title.lower() in ("private video", "deleted video"):
            continue
        out.append(
            {
                "id": vid,
                "title": title,
                "desc": (s.get("description") or "").strip(),
                "date": (cd.get("videoPublishedAt") or s.get("publishedAt") or "")[:10],
                "own": s.get("videoOwnerChannelTitle", "") == OWN_CHANNEL,
            }
        )
    return out


# ---------- Source 2: public extraction with yt-dlp (production) ----------
def fetch_ytdlp(playlist_id):
    proc = subprocess.run(
        [
            "yt-dlp",
            "--flat-playlist",
            "--dump-single-json",
            "https://www.youtube.com/playlist?list=" + playlist_id,
        ],
        capture_output=True,
        timeout=120,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode()[:300])
    entries = json.loads(proc.stdout.decode()).get("entries") or []
    out = []
    for e in entries:
        vid = e.get("id")
        title = (e.get("title") or "").strip()
        if not vid or title.lower() in ("[private video]", "[deleted video]"):
            continue
        meta = SNAPSHOT_META.get(vid, {})
        date = meta.get("date", "")
        if not date and e.get("timestamp"):
            date = time.strftime("%Y-%m-%d", time.gmtime(e["timestamp"]))
        out.append(
            {
                "id": vid,
                "title": title,
                "desc": meta.get("desc", ""),
                "date": date,
                "own": (e.get("channel") or e.get("uploader") or "") == OWN_CHANNEL,
            }
        )
    return out


def fetch_playlist(playlist_id):
    try:
        return fetch_connector(playlist_id)
    except Exception:
        return fetch_ytdlp(playlist_id)


def build_payload(cage_raw, game_raw):
    cage = []
    for v in cage_raw:
        cage.append(
            {
                "id": v["id"],
                "title": v["title"],
                "desc": v.get("desc", ""),
                "date": v.get("date", ""),
                "players": tag_players(v["title"], v.get("desc", "")),
            }
        )
    cage.sort(key=lambda v: v["date"], reverse=True)
    game = []
    for v in game_raw:
        if not v.get("own", True):
            continue
        game.append(
            {
                "id": v["id"],
                "title": v["title"],
                "desc": v.get("desc", ""),
                "date": v.get("date", ""),
                "players": tag_players(v["title"], v.get("desc", "")),
                "result": result_label(v["id"], v["title"]),
            }
        )
    return {
        "cage": cage,
        "game": game,
        "updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


_cache = {"data": None, "ts": 0.0}
_lock = threading.Lock()


def get_data():
    with _lock:
        now = time.time()
        if _cache["data"] and now - _cache["ts"] < CACHE_TTL:
            return _cache["data"]
        try:
            cage_raw = fetch_playlist(CAGE_PLAYLIST)
            game_raw = fetch_playlist(GAME_PLAYLIST)
            if not cage_raw:
                raise RuntimeError("empty cage playlist")
            data = build_payload(cage_raw, game_raw)
            _cache["data"] = data
            _cache["ts"] = now
            return data
        except Exception:
            if _cache["data"]:
                return _cache["data"]  # stale-if-error
            data = build_payload(SNAPSHOT.get("cage", []), SNAPSHOT.get("game", []))
            data["source"] = "snapshot"
            return data


# ---------- CLI utilities ----------
def write_snapshot():
    cage = fetch_connector(CAGE_PLAYLIST)
    game = fetch_connector(GAME_PLAYLIST)
    with open(SNAPSHOT_PATH, "w") as f:
        json.dump({"cage": cage, "game": game}, f, ensure_ascii=False, indent=1)
    print("snapshot written:", len(cage), "cage /", len(game), "game")


def test_ytdlp():
    cage = fetch_ytdlp(CAGE_PLAYLIST)
    game = fetch_ytdlp(GAME_PLAYLIST)
    payload = build_payload(cage, game)
    print("ytdlp cage:", len(payload["cage"]), "game:", len(payload["game"]))
    print("first cage:", payload["cage"][0])
    print("first game:", payload["game"][0])


# ---------- FastAPI app ----------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)


@app.get("/api/videos")
def videos():
    try:
        return get_data()
    except Exception as e:
        return {"error": str(e)[:200], "cage": [], "game": []}


@app.get("/api/health")
def health():
    return {"ok": True}


if __name__ == "__main__":
    import sys

    if "--snapshot" in sys.argv:
        write_snapshot()
    elif "--test-ytdlp" in sys.argv:
        test_ytdlp()
    else:
        import uvicorn

        uvicorn.run(app, host="0.0.0.0", port=8000)
