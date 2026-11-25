# Tests

Serve the repo root first: `python3 -m http.server 8765`. Needs Node with Playwright and Chromium.

- `node tests/e2e.js`: full flow at phone and desktop size (editor, favorites, situation picker, backs, page order, PDF download, no outside requests, clean console). Runs in a browser without emoji/symbol fonts; `SYSTEM_FONTS=1` uses the normal ones.
- `node tests/no-system-emoji.js`: every card emoji has a bundled image; no card text node contains emoji or symbol codepoints, for all designs, both backs and all sizes.
- `node tests/check-sentences.js`: every sentence template, for boy/girl × we/I(m)/I(f), has no leftover syntax and ends with punctuation.
- `node tests/ui-shots.js`: refreshes the UI screenshots in `docs/previews`.
