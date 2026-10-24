# IIUC CampusMate (ক্যাম্পাস-সাথী)

> **One line:** An AI-powered daily campus life and study copilot that decodes handwritten lecture notes into exam quizzes, navigates Kumira university bus timetables with voice alerts, deciphers scattered campus notices, and generates 1-click printable academic leave applications for IIUC students.

---

## The problem
Who faces it, and how they deal with it today:
Over 20,000 students at the International Islamic University Chittagong (IIUC) campus in **Kumira, Sitakunda (25km outside Chittagong city)** face the same daily frustrations:
1. **Commuter & Transport Chaos:** Commuters from Chawkbazar, GEC, Bahaddarhat, Agrabad, and Muradpur never know when the next bus to Kumira departs, weekend shifts, or counter delays. Today, students rely on chaotic Facebook groups and calling friends.
2. **Scattered Notices & Red Tape:** Exam dates, fee deadlines, and room changes are posted as physical papers or noisy group photos. Missing an exam due to sickness requires navigating three different offices (Dean, Chairman, Provost) within 3 days; students routinely receive "F" grades because they don't know the exact administrative paperwork format.
3. **Locked Lecture Notes:** Handwritten lecture notes and past questions sit in phones as unorganized photos. Students struggle to extract formulas or test their knowledge before exams.
4. **Dorm Sickness & Stress:** Living far from the city in Usman and Ali residential halls, sick students at night don't know whether to rest in the dorm, visit the Kumira campus medical center, or call an ambulance to CMCH hospital.

---

## The solution
What your app does, in 3–4 sentences:
**IIUC CampusMate** is a bilingual (বাংলা ও English) campus companion powered by open-source **Gemma 4** multimodal vision and **ElevenLabs** natural voice. 
Students can photograph handwritten notebook pages to get an instant plain-Bangla concept breakdown and 3-question self-test practice quiz with audio read-aloud. 
The Kumira Bus Navigator provides real-time countdown timers, counter boarding gates, and voice departure alerts for all 16 university routes. 
For campus bureaucracy and sickness, it decodes paper notices and automatically generates official, print-ready A4 academic leave applications formatted for IIUC department chairmen, alongside a 4-tier student health triage engine and hall SOS emergency alerts.

---

## How it works
- **Model(s) used:**
  - **[Gemma 4 / Gemma Multimodal](https://ai.google.dev/gemma):** Open-weights vision & language model used to transcribe Bengali/English handwritten lecture notes, analyze university paper notices, and generate contextual practice quizzes.
  - **[ElevenLabs Multilingual V2](https://elevenlabs.io):** Natural voice synthesis for reading study summaries, bus departure announcements, and pre-exam relaxation guidance (with browser-native Web Speech fallback).
- **Tech stack:**
  - **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
  - **Backend:** Node.js, Express API gateway, `@google/genai` SDK
  - **Design System:** Upscale-inspired glassmorphism, floating ambient glow orbs, curved underline SVG accents, responsive mobile-first architecture
- **Datasets (if any):**
  - Verified IIUC Kumira ⇄ Chittagong City Bus Transport Schedules (Chawkbazar, GEC, Bahaddarhat, Agrabad counters)
  - Sample CSE-3501 Database Normalization handwritten lecture note dataset

---

## How to run it

### 1. Clone the repo
```bash
git clone https://github.com/your-username/iiuc-campusmate.git
cd iiuc-campusmate
```

### 2. Install requirements
```bash
npm install
# (On Windows PowerShell if scripts are blocked, use: npm.cmd install)
```

### 3. Set API Keys (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your free [Google AI Studio API key](https://aistudio.google.com/) for Gemma and optional ElevenLabs key:
```env
PORT=3000
GEMINI_API_KEY="your-gemini-key"
ELEVENLABS_API_KEY="your-elevenlabs-key" # (Optional: falls back to browser voice)
```
*(The app is fully functional with preloaded authentic sample data even before adding API keys!)*

### 4. Run the app
```bash
npm run dev
# (Or in Windows PowerShell: npm.cmd run dev)
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Key Features & Demo Walkthrough

### 1. 📚 Study Hub & Exam Quiz (Gemma 4 Multimodal + ElevenLabs)
- Snap a photo or upload handwritten lecture notes / past question papers.
- Gemma 4 transcribes handwriting, diagrams, and equations.
- Generates a clear Bangla explanation (`সহজ ভাষায় ব্যাখ্যা`) and academic English summary.
- Creates an interactive 3-question mock quiz with instant answer evaluation and rationale.
- Click **"ইলেভেনল্যাবস অডিও শুনুন"** to hear natural speech audio of the summary while commuting on the bus.
- Click **"নমুনা সিএসই নোট দেখুন"** for instant 1-tap demo testing.

### 2. 🚌 Kumira Bus Navigator
- Covers all major IIUC routes: Chawkbazar, GEC Circle, Bahaddarhat, Muradpur, Agrabad, and Boropool.
- Live countdown timer to the next scheduled departure.
- Filter by **"City ➔ Kumira Campus"** or **"Kumira Campus ➔ City"**.
- Counter boarding gates, estimated travel time, route stop timeline, and student ID advisory.
- Voice announcement button: audio read-out of next departure.

### 3. 📋 Campus Notices & 1-Click Leave Generator
- Decodes university notice photos: extracted deadlines, fees, and exact office room numbers (e.g. Admin Building Room 304).
- **Official A4 Leave Application Builder:** Pre-fills student ID, department, and illness reason into an official formatted university letter ready for Chairman / Dean / Provost sign-off.
- Click **"Print / Save as PDF"** to print directly from the browser.

### 4. 🩺 Campus Care & Dorm SOS (Student Wellbeing)
- **4-Tier Deterministic Health Triage:** Evaluates fever, cafeteria food contamination, and distress to recommend:
  - *Tier 1: Hall Rest & Hydration*
  - *Tier 2: IIUC Kumira Campus Medical Center*
  - *Tier 3: Specialized Diagnostic Clinic*
  - *Tier 4: Immediate Hospital Emergency (CMCH / 999)*
- **Mind-Care 4-4-4 Box Breathing:** 1-minute guided pre-exam panic de-stress exercise.
- **One-Tap Emergency SOS:** Pre-filled WhatsApp and direct SMS alert to hall roommates and assistant provosts.

---

## What's not done yet (Honest Limitations)
- Live GPS tracking of physical IIUC buses (requires hardware GPS trackers on university bus fleets; currently powered by scheduled timetables).
- Dynamic course syllabus sync across all IIUC faculties (currently tested with CSE, BBA, and EEE curriculum samples).
- Push notifications on mobile require PWA service worker registration on HTTPS.

---

## Credits & Attribution
- Built for **Hacktoberfest Hack Day Chittagong x IEEE Computer Society IIUC SBC** organized by **ML Bangladesh**.
- Inspired by real campus challenges faced by students at the International Islamic University Chittagong (Kumira, Sitakunda).
- Open-weights AI: **Google Gemma 4 / Gemma Multimodal**.
- Voice AI: **ElevenLabs Multilingual V2**.
- Icons: **Lucide React**.
- Styling: **Tailwind CSS v4**.
