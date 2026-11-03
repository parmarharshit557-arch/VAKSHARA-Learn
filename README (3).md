# VAKSHARA Learn — V6 Teaching Rebuild

This is the updated V6 learning build. It keeps the VAKSHARA brand, logo and course navigation, and strengthens the absolute-beginner teaching path.

## Open the correct build on Windows
1. Extract the ZIP into a **new folder**.
2. Open `VAKSHARA-Learn-v6-TEACHING-REBUILD`.
3. Double-click `START-VAKSHARA.bat`.
4. The correct browser address is **http://127.0.0.1:8766/**.

The previous prototypes used port 8000. If you see `:8000`, you are still viewing an older local server. The new launcher uses port 8766 specifically to avoid that mix-up.

If Smart App Control blocks the launcher, open `vakshara_learn` in File Explorer, type `cmd` in the address bar, and run:

```bash
py -m http.server 8766 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8766/`.

## Student learning path
Homepage → Explore learning → choose a subject → Python welcome → choose English or Hinglish → Start Here: Python from Zero → topic folders → teacher walkthrough → lesson roadmap → detailed explanations and worked examples → five-question topic quiz → result, explanations and retry.

## Teaching improvements in this rebuild
- Four fully written absolute-beginner chapters: programming/Python, where Python runs, first program/print/comments/indentation, and variables.
- Those four starter chapters have full English and Roman Hinglish detailed notes, a teacher walkthrough, examples, output and line-by-line traces.
- The other 45 topics retain their uploaded-notebook explanations, worked code examples, outputs, rules and common mistakes. Each lesson now shows a topic-specific teacher opening and a roadmap extracted from its lesson sections before the detailed notes.
- Every lesson has a five-question concept quiz with score, answer feedback and retry.
- Long independent coding assignments/question banks are kept out of Learn and reserved for VAKSHARA Labs.
- The main teacher walkthrough and quiz are bilingual. The extended notebook-derived detailed notes for the 45 source topics are still English in this release; the four new starter chapters are bilingual.
- Topics not present in the uploaded notes (such as functions in depth, dictionaries, exception handling, file handling, OOP, testing, APIs, SQL and later data/ML modules) remain upcoming. This build does not claim that the current notes alone make a learner job-ready.

## Content and technical checks
- 7 unique uploaded notebooks; duplicate Conditional Statements copy identified.
- 49 available Python lesson folders: 4 from-zero starter chapters plus 45 notebook-mapped topics.
- Original VAKSHARA logo assets retained.
- Login/MySQL, Google Sheets sync, online deployment and printable-PDF downloads are not connected yet.
- Self Tracker saves in this browser only.
