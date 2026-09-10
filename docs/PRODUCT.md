# Bangladesh 64 (Deshchena) — Product Specification

**Working Title:** Bangladesh 64 (`deshchena`)  
**Tagline:** *Can you find all 64?*  
**Platform:** Modern Web (Desktop, Tablet, Mobile)  

---

## 1. Product Vision
A fast, polished, interactive geography game inspired by map quiz classics like Seterra, but focused exclusively and authentically on Bangladesh. 

The MVP teaches players the 64 districts and 8 divisions of Bangladesh through an interactive "Find the District" map quiz. Future iterations will expand into Upazilas, Rivers, Major Cities, Historical Landmarks, and National Parks using the exact same engine.

---

## 2. Product Principles
1. **Gameplay First**: Prioritize speed, clarity, and fun. Every click must register instantly.
2. **Data Correctness > AI Cleverness**: Real geographic boundaries from authoritative sources. Never hallucinate geography.
3. **Deterministic Runtime**: Zero LLM dependencies at runtime. Fast, offline-capable, predictable.
4. **Mobile as First-Class Citizen**: Responsive map viewports, thumb-friendly tap targets, and touch-scroll prevention during map play.
5. **Clear Feedback**: Don't rely solely on color (e.g. green/red); always pair colors with explicit icons and text (✓ Correct, ✕ Incorrect).

---

## 3. MVP Scope
- **Geographic Scope**: 8 Divisions, 64 Districts with genuine MultiPolygon boundaries.
- **Languages**: English and Bangla (বাংলা) names for all districts and divisions.
- **Primary Game Mode**: `FindDistrictMode`
- **Session Configurations**:
  - Question count: 10, 25, 50, or All 64
  - Difficulty: Relaxed (no timer penalty, helpful hints), Normal (standard gameplay), Hard (strict speed window)
- **Key Features**:
  - Interactive SVG map with semantic district states (default, hover, active, correct, incorrect)
  - Real-time score, timer, streak counter, and progress bar
  - Instant answer evaluation with correct answer reveal on error
  - Game Over summary screen (accuracy %, score, best streak, missed districts list)
  - "Practice Mistakes" mode allowing players to immediately re-quiz on their missed districts
  - No user registration required to play

---

## 4. Explicit Non-Goals for MVP
- User authentication or accounts
- Backend servers or persistent databases
- Multiplayer / real-time chat
- In-game AI chatbots or LLM-generated geography
- Payments, monetization, or advertisements
- Bloated achievement frameworks or social feeds
