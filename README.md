# Fridge notes display

An always-on fridge board for a 2016 9.7-inch iPad Pro: one offline web page with fridge tabs, a Pencil ink pad per fridge and a free-text list per fridge.

## What is here

| Path | What it is |
| --- | --- |
| `index.html` | The whole app: markup, styles and script. No framework, no build step. |
| `sw.js` | Offline cache. Serves the app's files from the iPad, and refreshes them in the background while online. |
| `manifest.webmanifest`, `icon-180.png`, `icon-512.png` | Home Screen app details. `icon.svg` is the source of both PNGs. |
| `devtest.html` | Device test page: run it on the iPad before relying on the app (see below). Not linked from the app. |
| `docs/scope.md` | The scope: requirements, decisions, iPad setup and acceptance checks. |
| `design/Main.dc.html` | The Claude Design prototype (landscape, 1024 × 768 pt). A design reference only; it runs inside the Claude Design canvas, not on its own. |

The app is built for landscape. Portrait is not designed yet, so until it is, keep the iPad in landscape (see [iPad setup](#ipad-setup)).

## Run it locally

From the repository root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. On a desktop the mouse writes on the ink pad, so the app can be tried without a Pencil.

The service worker serves cached files first and refreshes them in the background, so after editing a file, reload twice to see the change. In Chrome, DevTools → Application → Service workers → "Update on reload" does the same.

## Publish on GitHub Pages

1. Make the repository public. Settings → Pages → Build and deployment → Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)**.
2. The app is then at `https://<account>.github.io/fridge_notes/`, and the device test page at `.../fridge_notes/devtest.html`.
3. Keep the account and repository names unchanged. The iPad's saved notes belong to that exact address.

## Device test first

Before setting up the board, open `devtest.html` in Safari on the iPad, add it to the Home Screen and launch it from there. Then check:

- **Scribble:** writing in the text field with the Pencil becomes text.
- **Ink:** drawing on the canvas with the Pencil leaves ink, and resting a palm on it leaves none ("Touches ignored" counts up instead).
- **Scribble against ink:** fast Pencil strokes near the text field are not dropped. Try with "Scribble fix" off and on. The app ships with the fix on.
- **Restart:** strokes and saved text are still there after closing the app and restarting the iPad.
- **Screen size:** note the "Window" and "Safe area" readings. The app's pad is laid out for 1024 × 768 and scales down if the status bar takes some of it.

## iPad setup

Follow the iPad setup steps in [`docs/scope.md`](docs/scope.md#ipad-setup). In short:

1. Open the Pages address in Safari, choose Share → Add to Home Screen, and launch the app from that icon **once while online**. Home Screen apps keep their own storage and offline copy, separate from Safari.
2. Turn on Rotation Lock with the iPad in landscape. When starting Guided Access, also turn **Motion** off. Turn both back on once portrait is built.
3. Start Guided Access from inside the app.

## Updating the app on the iPad

Push the change to `main` and wait for Pages to publish it. Then:

1. On the iPad, exit Guided Access (triple-click the Home button and enter the passcode).
2. Close the app, then open it while online. It downloads the new files in the background.
3. Close it and open it once more to run the new version.
4. Start Guided Access again.

Saved notes are untouched by updates.

## Where the data lives

Everything is in the Home Screen app's localStorage under the key `fridgeNotes`, as one versioned JSON object (see the Storage row in [`docs/scope.md`](docs/scope.md#build-approach)). If saved data ever can't be read, the app starts fresh and keeps the unreadable copy under `fridgeNotes.unreadable.<date>`.
