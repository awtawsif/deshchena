# Bangladesh 64 (Deshchena) — Game Design & Rules

## 1. Core Game Loop: Find the District

```text
       START
         │
         ▼
    Select Settings (Question count: 10, 25, 50, 64; Difficulty: Relaxed, Normal, Hard)
         │
         ▼
    Load Map & Generate First Question (e.g. "Find Gazipur / গাজীপুর")
         │
         ▼
    Player Clicks a District on the Map
         │
   ┌─────┴────────────────┐
   ▼                      ▼
[CORRECT]              [INCORRECT]
   │                      │
   ├─ Visual success pulse ├─ Visual error pulse
   ├─ +100 Base Points    ├─ Reveal correct district
   ├─ +Speed bonus        ├─ Reset streak to 0
   ├─ +Streak bonus       ├─ Record district as mistake
   └─ Next Question       └─ Next Question
         │                │
         └────────┬───────┘
                  ▼
          All Questions Answered?
            /          \
          NO            YES
          │              │
          ▼              ▼
     Next Question    Results Screen
                         │
                         ├─ Score, Time, Accuracy %
                         ├─ Best Streak
                         └─ Button: "Practice Mistakes"
```

---

## 2. Scoring System

The scoring module (`src/game/scoring/`) uses deterministic formulas:

```text
Base Score per correct answer = 100 points
Speed Bonus = max(0, 50 - (secondsElapsed * 5))
Streak Bonus = min(50, currentStreak * 10)

Total Correct Score = 100 + speedBonus + streakBonus
Total Incorrect Score = 0
```

On an incorrect answer:
- Score change = 0
- Streak resets to 0
- District is recorded into `mistakes: string[]`

---

## 3. Practice Mistakes Mode
- If `mistakes.length > 0`, the player can click **Practice Mistakes**.
- A new session is initialized containing only the missed districts.
- If no mistakes were made (100% accuracy), celebratory feedback is shown: *"Perfect! Nothing to practice."*

---

## 4. Difficulty Settings
- **Relaxed**: No time pressure, timer does not decay score, visual highlight hints for division boundaries.
- **Normal**: Standard scoring with speed & streak bonus, timer active.
- **Hard**: 5-second rapid timer per question, zero hints, higher speed bonus weighting.
