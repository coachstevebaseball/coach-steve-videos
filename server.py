#!/usr/bin/env python3
"""Coach Steve Film Room — live playlist API (port 8000).

Reads both YouTube playlists through the user's connected YouTube account
and serves fresh, normalized video data to the frontend. Results are cached
in memory for 15 minutes; if a refresh fails, the last good data is served.
"""
import asyncio
import json
import re
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

CAGE_PLAYLIST = "PLf-AYFJb_UQ0"
GAME_PLAYLIST = "PLOJLN7PMUYVg"
OWN_CHANNEL = "Coach Steve Baseball"
CACHE_TTL = 15 * 60  # seconds

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

# Curated result labels for known game clips; new clips fall back to keywords.
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


def tag_players(title: str, desc: str):
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


def result_label(video_id: str, title: str) -> str:
    if video_id in RESULTS:
        return RESULTS[video_id]
    t = title.lower()
    for pattern, label in RESULT_KEYWORDS:
        if re.search(pattern, t):
            return label
    return ""


async def call_tool(source_id, tool_name, arguments):
    proc = await asyncio.create_subprocess_exec(
        "external-tool",
        "call",
        json.dumps({"source_id": source_id, "tool_name": tool_name, "arguments": arguments}),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await proc.communicate()
    if proc.returncode != 0:
        raise RuntimeError(stderr.decode()[:500])
    return json.loads(stdout.decode())


async def fetch_playlist(playlist_id: str):
    items = await call_tool(
        "youtube_data_api__pipedream",
        "youtube_data_api-list-playlist-videos",
        {"playlistId": playlist_id, "maxResults": 50},
    )
    if isinstance(items, dict):  # defensive: some connectors wrap results
        items = items.get("result") or items.get("items") or []
    out = []
    for it in items:
        s = it.get("snippet", {})
        cd = it.get("contentDetails", {})
        vid = cd.get("videoId") or s.get("resourceId", {}).get("videoId")
        if not vid:
            continue
        title = (s.get("title") or "").strip()
        if title.lower() in ("private video", "deleted video"):
            continue
        desc = (s.get("description") or "").strip()
        out.append(
            {
                "id": vid,
                "title": title,
                "desc": desc,
                "date": (cd.get("videoPublishedAt") or s.get("publishedAt") or "")[:10],
                "players": tag_players(title, desc),
                "own": s.get("videoOwnerChannelTitle", "") == OWN_CHANNEL,
            }
        )
    return out


_cache = {"data": None, "ts": 0.0}
_lock = asyncio.Lock()


async def get_data():
    async with _lock:
        now = time.time()
        if _cache["data"] and now - _cache["ts"] < CACHE_TTL:
            return _cache["data"]
        try:
            cage, game = await asyncio.gather(
                fetch_playlist(CAGE_PLAYLIST), fetch_playlist(GAME_PLAYLIST)
            )
            cage.sort(key=lambda v: v["date"], reverse=True)
            game_own = [v for v in game if v["own"]]
            for v in game_own:
                v["result"] = result_label(v["id"], v["title"])
            data = {
                "cage": cage,
                "game": game_own,
                "updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
            _cache["data"] = data
            _cache["ts"] = now
            return data
        except Exception:
            if _cache["data"]:
                return _cache["data"]  # stale-if-error
            raise


app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)


@app.get("/api/videos")
async def videos():
    try:
        return await get_data()
    except Exception as e:
        return {"error": str(e)[:200], "cage": [], "game": []}


@app.get("/api/health")
def health():
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
