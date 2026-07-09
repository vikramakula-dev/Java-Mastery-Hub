# Java For Selenium Mastery

An offline Core Java learning platform designed for Selenium automation interview preparation.

## Current Status

The live application currently loads the root `app.js` directly from `index.html`.
This is the safest runtime path while the modular refactor is incomplete. The files
inside `js/`, `data/`, `css/`, and `utils/` are scaffolding and are not the current
source of truth.

The detailed development history, feature inventory, architecture notes, known
issues, and continuation instructions are in
[`PROJECT_HANDOFF_FOR_CLAUDE_GEMINI.md`](PROJECT_HANDOFF_FOR_CLAUDE_GEMINI.md).

## Run

Open `index.html` in a browser. The project is intentionally dependency-free and
does not require a build command or web server.

## Active Files

- `index.html`: application shell and UI regions
- `style.css`: complete premium visual design
- `app.js`: lesson data, rendering, state, interactions, and persistence

## Supporting Scaffolding

- `js/`: proposed feature modules
- `data/`: proposed lesson data modules
- `css/`: proposed split stylesheets
- `utils/`: proposed shared utilities

Do not switch `index.html` to `js/app.js` until the modular files are made fully
self-contained and tested through the browser.
