// Coach Steve Baseball — video data (from YouTube playlists)
const CAGE_VIDEOS = [
 {
  "id": "oeafv6e-PyU",
  "title": "Sean Mack 13u. Problem: squishing the bug. Solution: utilize lower half",
  "desc": "",
  "date": "2026-08-05",
  "players": [
   "Sean"
  ]
 },
 {
  "id": "ZhEy9ZP47YQ",
  "title": "Two days of feeling like he can't buy a hit. Problem identified. 2-run HR two days later.",
  "desc": "",
  "date": "2026-08-03",
  "players": []
 },
 {
  "id": "yOE1ou4xIpM",
  "title": "TRAIN HARDER IN PRACTICE SO WHEN THE GAME COMES, IT SLOWS DOWN",
  "desc": "Train with relentless intensity, pushing beyond the limits of the competition, so that when the moment arrives, everything feels effortless and within your control. Last night, Joe overlooked nearly everything — increased speed, various perspectives, overburdened bats, and brief bats. There was no sense of comfort and nothing intended to enhance his appearance.\n\nTo many observers, it appeared to be an unsuccessful session. It was not. The aim isn't to take control of practice; it's designed to make the game seem simpler in comparison.\n\nToday, in two matches, Joe went 6 AB, 4 Hits, 2 doubles, 2 singles, 6 RBIs, and 6 runs. I focus on training hitters to perform effectively, not just to look impressive in the cage — I guide them to deliver results when it matters most. ⚾🔥\n\nThis paragraph version keeps the stat line intact for readability while flowing the surrounding narrative into three connected paragraphs instead of the original line-by-line format, which tends to work well for YouTube Shorts descriptions where viewers skim on mobile.",
  "date": "2026-07-25",
  "players": [
   "Joe"
  ]
 },
 {
  "id": "OPj6xPAM81A",
  "title": "🔥 The Mack brothers have very different personalities but share a strong competitive drive",
  "desc": "🧠 They actively seek challenges and want to test themselves against others\n⚔️ Their goal is to win, and they embrace competition without hesitation.\n💥 They are unafraid to fail and use it as part of their growth.\n🚀 This mindset positions them for success both in baseball and in life",
  "date": "2026-07-25",
  "players": []
 },
 {
  "id": "Mc7nAUJZKtU",
  "title": "overspeed training session. Approximately 90 miles per hour and situated 20 feet away",
  "desc": "",
  "date": "2026-05-20",
  "players": []
 },
 {
  "id": "Ma6tIab-Hcg",
  "title": "Inside-outside tee. Goal. Focus on proper contacts points. Hitting the ball to all fields.",
  "desc": "",
  "date": "2026-05-11",
  "players": []
 },
 {
  "id": "rc2NMXCqLxs",
  "title": "Small Batting Stance Fix That Helped Gavin Drive the Ball Harder",
  "desc": "By making a small correction and identifying one tiny flaw in the swing, Gavin was able to stop hitting weak ground balls and start driving the ball with more power to left-center and center field.",
  "date": "2026-05-04",
  "players": [
   "Gavin"
  ]
 },
 {
  "id": "nS6_AA2lHPI",
  "title": "Gunnar: Stance & Rhythm Adjustment",
  "desc": "The Goal: Open the stance for better vision and create fluid rhythm. Focus on a controlled negative move and coiling into the back hip.",
  "date": "2026-05-01",
  "players": [
   "Gunnar"
  ]
 },
 {
  "id": "upsLOxk9JLk",
  "title": "Gavin Goldstein: 16u Lefty Sliders",
  "desc": "Situational hitting: 2 outs, 1-1 count. Analyzes the swing path required to stay through the ball to left-center against off-speed.",
  "date": "2026-05-01",
  "players": [
   "Gavin"
  ]
 },
 {
  "id": "a7XiYiRZg8o",
  "title": "Gunnar Early Nov 2025",
  "desc": "",
  "date": "2026-04-30",
  "players": [
   "Gunnar"
  ]
 },
 {
  "id": "OSp71UCubXA",
  "title": "Sean Mack | 13U — Smooth left-handed swing getting smoother every session.",
  "desc": "",
  "date": "2026-04-28",
  "players": [
   "Sean"
  ]
 },
 {
  "id": "hFsiCgsxz8o",
  "title": "Jaden Balone: 16-year-old center fielder out of Oceanside, NY.",
  "desc": "The focus of tonight’s session? A full stance overhaul. We rebuilt his setup to create better separation, improve sequencing, and build a more consistent platform to time the pitcher. By narrowing his base, we got him into a position where his body can actually do what it’s capable of doing.\nThe results were immediate—and the metrics backed it up:\n📈 Bat speed: Up significantly.\n🎯 On-plane connection: Up 10-15 degrees above his baseline.\n\nThat last number is the real story. When you combine elevated on-plane time with increased bat speed, you aren’t just making contact—you’re doing damage consistently to all fields. That combination is exactly what separates hitters who look good in the cage from hitters who produce in games.\n\nIncredibly proud of the work Jaden put in tonight. He bought in immediately, trusted the process, and let his athleticism take over once the mechanics gave it somewhere to go.\nThe ceiling here is sky-high. 🚀",
  "date": "2026-04-04",
  "players": [
   "Jaden"
  ]
 },
 {
  "id": "uwxbM0a_I3o",
  "title": "14-Year-Old Gunnar Nelson Working on the Outside Angle Toss Drill",
  "desc": "The Outside Angle Toss drill fixes common issues like lunging at outside pitches, pulling the ball, and failing to drive the ball to the opposite field. By reinforcing proper stride alignment and bat path, it helps hitters stay inside the ball, improve contact quality, and increase their ability to handle pitches on the outer half of the plate.",
  "date": "2026-04-04",
  "players": [
   "Gunnar"
  ]
 },
 {
  "id": "N7KvjX0ANQ0",
  "title": "Gavin Goldstein: Situational Approach",
  "desc": "Training reps focused on driving the ball based on game-specific counts and scenarios.",
  "date": "2026-03-29",
  "players": [
   "Gavin"
  ]
 },
 {
  "id": "dfww-Sb_CVw",
  "title": "EMMET’S SWING TRANSFORMATION — 72 DAYS APART: Swipe to see exactly what changed. 👉👉",
  "desc": "",
  "date": "2026-03-24",
  "players": [
   "Emmett"
  ]
 },
 {
  "id": "fXubxS7SqJI",
  "title": "Learning Zone Awareness and Hunting Zones. Good hitters become great with this ability.",
  "desc": "- ⚾ Home plate is 17 inches wide, but not every strike is a hittable pitch at higher levels  \n- 🎯 Hitters must understand which parts of the plate they handle best vs. worst  \n- 🧠 The 7-Ball drill builds spatial awareness by mapping the strike zone physically  \n- 🚫 Removing edge pitches trains hitters to avoid swinging at the pitcher’s pitches  \n- 💥 Focusing on the heart of the plate leads to more decisive, powerful swings  \n- 🔍 Sean demonstrates strong zone awareness and attacks pitches he can damage  \n- 📈 In advantage counts, shift from protecting to hunting specific pitches",
  "date": "2026-03-21",
  "players": [
   "Sean"
  ]
 },
 {
  "id": "IR2J-DAW2bs",
  "title": "Most kids do T-work wrong.",
  "desc": "Most kids do tee work wrong. from placing the tee in the wrong location, mindless swings, to ignoring the purpose of the drill, it's easy for bad habits to sneak in.\n\nIf the tee is too far out front, they're practicing hitting only pitches out of the zone. If it's always in the same spot, they're not learning to adjust. And when swings become just reps for the sake of reps, kids disconnect from the \"why\"—the specific skill or feel they're supposed to be building.\n\nTo fix this:\n\nVary the tee location – move it inside, outside, up, and down. Make every swing mimic a real pitch location.\nHave a purpose for each round – focus on driving the ball up the middle, staying inside the ball, or working on an outside pitch.\nSlow down – quality over quantity. Ask the hitter what they're feeling or what they’re trying to do.\nFinish with intent – every swing should be game-like, not just going through the motions.\n\nTee work, done right, is a powerful tool. It builds consistent mechanics and confidence. But it has to be intentional. Don’t let it become just another routine.",
  "date": "2026-03-14",
  "players": []
 },
 {
  "id": "1AIPNEs6MS4",
  "title": "Sean 3 Plate Fast Ball Drill Machine",
  "desc": "",
  "date": "2026-02-28",
  "players": [
   "Sean"
  ]
 },
 {
  "id": "e0fxG4wieOc",
  "title": "Samuel Vargas performing slow negative move with controlled forward move and an explosive swing",
  "desc": "",
  "date": "2026-02-28",
  "players": [
   "Sam"
  ]
 },
 {
  "id": "KD5vZd9bIn0",
  "title": "Land Controlled, Then Explode: The Key to Elite Hitting",
  "desc": "Controlling the negative move so you land the forward move under control is what lets elite hitters explode into contact — timing and balance before power",
  "date": "2026-02-28",
  "players": []
 },
 {
  "id": "lvae0VQ8fOY",
  "title": "Gunnar Nelson 14u | Session Blast Metrics: Bat Speed: 65 mph, Rot. Accel: 8.7",
  "desc": "",
  "date": "2026-02-27",
  "players": [
   "Gunnar"
  ]
 },
 {
  "id": "cDCv8ACU9Nw",
  "title": "2026-02-20 Sean J Inside Angle Toss",
  "desc": "",
  "date": "2026-02-21",
  "players": [
   "Sean"
  ]
 },
 {
  "id": "txSD_tKUrmM",
  "title": "Nathan Controlling His Forward Move  Explosive on Both Sides of the Plate",
  "desc": "",
  "date": "2026-02-17",
  "players": [
   "Nathan"
  ]
 },
 {
  "id": "wT4H-BOWyho",
  "title": "Jack before and after",
  "desc": "",
  "date": "2026-02-07",
  "players": [
   "Jack"
  ]
 },
 {
  "id": "EMWV_D8wB50",
  "title": "Sean working on his first session, staying balanced through his swing",
  "desc": "",
  "date": "2026-01-30",
  "players": [
   "Sean"
  ]
 },
 {
  "id": "Eli0ERr-5qc",
  "title": "January 29, 2026",
  "desc": "",
  "date": "2026-01-30",
  "players": []
 },
 {
  "id": "dskXHl_c0VI",
  "title": "Gavin Closed Stance",
  "desc": "",
  "date": "2026-01-30",
  "players": [
   "Gavin"
  ]
 },
 {
  "id": "ujOLzvxkFic",
  "title": "Sam walking towards him  Him doing the rhythm drill January 18th",
  "desc": "",
  "date": "2026-01-30",
  "players": [
   "Sam"
  ]
 },
 {
  "id": "k6PpEcDzND4",
  "title": "Gunner two plate fastball drill.",
  "desc": "",
  "date": "2026-01-28",
  "players": [
   "Gunnar"
  ]
 },
 {
  "id": "uuJMlkc_tVM",
  "title": "Curveball Drill with Two Plate Adjustments.",
  "desc": "",
  "date": "2026-01-28",
  "players": []
 },
 {
  "id": "quk5pjARILc",
  "title": "The Knee-to-Knee Drill.",
  "desc": "",
  "date": "2026-01-18",
  "players": []
 }
];

const GAME_VIDEOS = [
 {
  "id": "HqMqTy4dq90",
  "title": "Antonio Rao 15u. 2 out. 2 rbi single. Clutch hitting with runners in scoring position.",
  "desc": "",
  "date": "2026-08-04",
  "players": [
   "Antonio"
  ],
  "result": "2-RBI single"
 },
 {
  "id": "SmT1JeBoSdw",
  "title": "Antonio Rao",
  "desc": "",
  "date": "2026-08-03",
  "players": [
   "Antonio"
  ],
  "result": "Base knock"
 },
 {
  "id": "mGD6R_hpnCk",
  "title": "He hit balls all over the field after struggling to get an at-bat. From last to fifth in the lineup",
  "desc": "",
  "date": "2026-05-02",
  "players": [],
  "result": "Last to 5th in the lineup"
 },
 {
  "id": "zBwEEfyYjFs",
  "title": "Gunnar Perfect Game Double",
  "desc": "",
  "date": "2026-03-01",
  "players": [
   "Gunnar"
  ],
  "result": "Perfect Game double"
 },
 {
  "id": "-TFKGUzqoYA",
  "title": "One game, Emmett goes 5-for-6 with a triple and a double, more hits than last season.",
  "desc": "",
  "date": "2026-05-04",
  "players": [
   "Emmett"
  ],
  "result": "5-for-6 · 3B + 2B"
 },
 {
  "id": "ZhEy9ZP47YQ",
  "title": "Two days of feeling like he can't buy a hit. Problem identified. 2-run HR two days later.",
  "desc": "",
  "date": "2026-08-03",
  "players": [],
  "result": "2-run home run"
 },
 {
  "id": "yOE1ou4xIpM",
  "title": "TRAIN HARDER IN PRACTICE SO WHEN THE GAME COMES, IT SLOWS DOWN",
  "desc": "Train with relentless intensity, pushing beyond the limits of the competition, so that when the moment arrives, everything feels effortless and within your control. Last night, Joe overlooked nearly everything — increased speed, various perspectives, overburdened bats, and brief bats. There was no sense of comfort and nothing intended to enhance his appearance.\n\nTo many observers, it appeared to be an unsuccessful session. It was not. The aim isn't to take control of practice; it's designed to make the game seem simpler in comparison.\n\nToday, in two matches, Joe went 6 AB, 4 Hits, 2 doubles, 2 singles, 6 RBIs, and 6 runs. I focus on training hitters to perform effectively, not just to look impressive in the cage — I guide them to deliver results when it matters most. ⚾🔥\n\nThis paragraph version keeps the stat line intact for readability while flowing the surrounding narrative into three connected paragraphs instead of the original line-by-line format, which tends to work well for YouTube Shorts descriptions where viewers skim on mobile.",
  "date": "2026-07-25",
  "players": [
   "Joe"
  ],
  "result": "6 AB · 4 H · 6 RBI"
 },
 {
  "id": "7B0P1wyjkyA",
  "title": "Gunnar hits a home run that leaves no doubts.",
  "desc": "",
  "date": "2026-08-05",
  "players": [
   "Gunnar"
  ],
  "result": "No-doubt home run"
 },
 {
  "id": "-O6pUAk8LqI",
  "title": "Jaden's 2-Strike Adjustments Show Up on Game Day",
  "desc": "",
  "date": "2026-08-05",
  "players": [
   "Jaden"
  ],
  "result": "2-strike battle won"
 },
 {
  "id": "LjUwZwk78Xw",
  "title": "2-0 count. Sitting on a pitch in his sweet spot, and he absolutely punishes it.",
  "desc": "",
  "date": "2026-08-05",
  "players": [],
  "result": "2-0 count, punished"
 }
];
