# Fridge notes display: web app scope

Oct 10, 2026 · @Scrimblo

## Summary

One full-screen web page turns a 2016 9.7-inch iPad Pro into an always-on board showing what is in each fridge, on three to six fridge tabs. Anyone in the kitchen can open a fridge, jot handwritten notes with the Apple Pencil, and add or remove listed items. The iPad is locked to this page, so nobody can wander out of it.

| Decision | Choice |
| --- | --- |
| Device | iPad Pro 9.7-inch (2016), used in portrait or landscape |
| App type | One web page, added to the Home Screen and run under Guided Access |
| Navigation | A home page with three to six fridge tabs and a Tabs menu; each tab opens that fridge's ink pad |
| Handwritten notes | A very large ink pad per fridge; ink stays as handwriting |
| Items | Free text only, kept in a separate list menu per fridge |
| Typed text | Written with the Pencil and converted by iPadOS Scribble, or typed on the on-screen keyboard. No voice dictation |
| Layout | Landscape laid out in Claude Design (`design/Main.dc.html`) and built. Portrait still to be designed |
| Data | Saved on the iPad only: no server, sync or backup |
| Hosting | GitHub Pages delivers the files once; after that the app runs from the iPad's own offline cache |
| Always on | Auto-Lock off, permanently on a charger |

## Device constraints

The 9.7-inch iPad Pro (2016) stops at iPadOS 16.7, so the page must run on Safari 16 for good.

| Area | What the iPad gives us | Effect on the build |
| --- | --- | --- |
| Software | Final OS is iPadOS 16.7.x; no iPadOS 17 ([Wikipedia](https://en.wikipedia.org/wiki/IPad_Pro_%281st_generation%29)) | Target Safari 16. Test on the iPad itself, not only a desktop browser. |
| Screen | 2048 × 1536 px, which is 1024 × 768 pt | Layout must fit 1024 × 768 pt in landscape and 768 × 1024 pt in portrait. |
| Pen | First-generation Apple Pencil | The page can tell pen from finger, so the ink pad can ignore hands. |
| Handwriting to text | Scribble works in standard web form fields and runs on the device ([Apple, Meet Scribble for iPad](https://developer.apple.com/videos/play/wwdc2020/10106/)) | Use ordinary text fields. There is no recognition code to write. |
| Storage | Home Screen web apps have their own usage counter, so Safari's seven-day clearing rule should not touch them ([WebKit](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)) | Save with localStorage, not cookies. Always open the app from its Home Screen icon. |

## Requirements

The app has three kinds of screen: a home page with three to six fridge tabs, a very large ink pad for each fridge, and a separate menu holding that fridge's list.

### Layout

The landscape layout, sizes and styling come from the Claude Design prototype (`design/Main.dc.html`). Portrait is still open.

Fixed:

- The home page shows three to six fridge tabs and one Tabs menu button.
- Each tab opens that fridge's screen: a very large ink pad with only an Add field.
- A separate menu holds the list-based form for that fridge.
- Every screen works in portrait and landscape.
- Turning the iPad keeps the same screen, half-typed text and ink.

Decided in the design and build:

- The fridge screen has a toolbar along the top (Home, the fridge name, Undo, Erase, Clear and List), the ink pad below it and the Add field along the bottom.
- The list menu is a panel that slides over the right side of the ink pad from the List button. Close list or Home closes it.
- The ink pad is a fixed page of 976 × 592 pt, the landscape pad. It is scaled to fit the space and centred, so ink keeps its shape and is never cropped. Strokes are saved with the page size, so a later layout can rescale them.
- When left idle for 5 minutes, the display returns to the home page.

Still open:

- Portrait (768 × 1024 pt) versions of every screen, including where the list goes. Until they exist, the iPad is kept in landscape (see iPad setup step 7).

### Home page

- Shows three fridge tabs to start, and up to six. One tap opens that fridge's ink pad.
- Tabs sit in three columns. The 4th tab rises from the bottom of the right column and halves the tab above it. The 5th does the same in the middle column and the 6th in the left.
- A Tabs button at the bottom left opens a small menu with Add tab and Delete a tab.
- Each tab has a Rename button. The label is an ordinary text field, so the Pencil or the keyboard can fill it. A new tab opens straight into renaming. Assumed: labels stop at 24 characters.
- Delete a tab puts a Delete button on every tab. A tab is removed only after Confirm. Later tabs then shift down one place and keep their colours.
- Assumed: the board never drops below three tabs.
- Labels wrap between whole words only. The text shrinks only when a label cannot fit that way.
- Each tab shows a centred "Tap to open" label.
- Colours: six pastels, one per tab, with dark text on a pale grey ground.
- Deleting a tab also removes its ink and list. After Confirm, an Undo bar shows for 10 seconds and puts the tab back in place with its colour, ink and list.

### Ink pad

- Each fridge has one very large ink pad, with only an Add field beside it on the screen.
- Only the Pencil draws. Finger and palm touches on the pad do nothing.
- Ink is stored as strokes and redrawn exactly as written. It is never converted to text.
- There is no panning, zooming or extra pages, so notes cannot get lost off screen.
- Ink can be erased stroke by stroke, undone and cleared. Clear can be undone.

### Add field

- Writing in it with the Pencil becomes text; a finger tap opens the keyboard.
- It adds a free-text item to the top of that fridge's list, with Enter or the Add button.

### List menu

- Holds the list-based form for one fridge: one item per row, newest at the top.
- Each item stores the date it was added and shows its age in days.
- Tapping an item edits its text in place.
- Each row has a visible Remove button. There are no swipe gestures.
- Removing shows an Undo bar for 10 seconds. The last 20 removed items per fridge stay restorable from a Recently removed button.

### Saving

- Every change saves to the iPad at once. There is no Save button.
- After a reload, crash or restart, the app reopens on the same tab with the same content.
- After the first visit, the page opens without a network connection.

### Hard to break

- Only three kinds of screen exist: the home page, a fridge's ink pad and its list menu. There are no outside links and no settings screen.
- Every screen shows a visible way back to the home page.
- Zoom, long-press menus, text-selection popups and pull-to-refresh are switched off.
- Controls are large and carry text labels. Exact sizes are set in the design.
- After 60 seconds idle, the keyboard closes and any half-typed text stays in the Add field.
- After 5 minutes idle, the display returns to the home page, closing the list and any menu. Half-typed text is kept until the app closes.
- If saved data cannot be read, the app starts with empty lists instead of a blank page, and keeps the unreadable copy.
- If saving fails, the app says so in plain words and keeps what was already saved.

## Out of scope

Version 1 leaves out anything that needs a server or a second screen.

- Server, accounts, sync, backup or editing from another device. Decided: the data is mundane and this adds complexity.
- Voice dictation. Decided: not needed.
- Handwriting recognition inside the app. iPadOS Scribble already provides it.
- Quantities, categories, expiry dates, reminders, shopping lists and barcode scanning.
- Reordering items or moving them between fridges.
- More than six fridge tabs, or reordering tabs by hand.
- Pen colours, pan and zoom, extra pad pages, exporting and printing.
- Other devices. A desktop browser only needs to work well enough for development.

## Build approach

Plain HTML, CSS and JavaScript with no framework and no build step keeps the app small enough to maintain by hand.

| Part | Choice |
| --- | --- |
| Files | `index.html` (markup, styles, script), `sw.js` (offline cache), a web app manifest and an icon, plus `devtest.html` for the device test |
| Hosting | [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) from a public repository: free, with a fixed github.io address and the HTTPS the offline cache needs. It only delivers the files; nothing is sent back. The site is public but holds only the app's code. |
| Storage | One versioned JSON object in localStorage: the active tab and the tab list (labels and colours), then items, removed items and ink strokes per fridge. Each stroke is a string of whole-number steps in half points, which keeps a full pad to a few hundred KB |
| Input | Pointer Events. The pad accepts pen input only. |
| Layout | Follows the layout agreed in Claude Design; must work at 1024 × 768 pt and 768 × 1024 pt |

Build order:

1. Layout in Claude Design: the home page, a fridge's ink pad screen and the list menu, in portrait and landscape.
2. Device test page: one text field and one canvas, added to the Home Screen. It confirms Scribble, Pencil ink, palm rejection, rotation and data surviving a restart.
3. Home page, ink pad screens and saving.
4. List menu.
5. Hardening: offline cache, gesture lock-down and the unreadable-data fallback.
6. iPad setup and the acceptance checks.

Status: steps 3 to 5 are built for landscape, and step 1 is done for landscape only. The step 2 page (`devtest.html`) is ready to run on the iPad.

## iPad setup

Built-in settings lock the iPad to the app and keep the screen on; no extra software is needed. The Guided Access steps follow the [Apple iPad User Guide](https://support.apple.com/guide/ipad/guided-access-ipada16d1374/16.0/ipados/16.0).

1. Update to the newest iPadOS 16.7 release. Then turn off Automatic Updates so the iPad does not restart itself.
2. Pair the Pencil and switch on Scribble in Settings > Apple Pencil.
3. Switch off Enable Dictation in Settings > General > Keyboard, so the keyboard has no mic key.
4. Set Auto-Lock to Never in Settings > Display & Brightness, and lower the brightness.
5. Open the page in Safari, choose Share > Add to Home Screen, and launch it from that icon from then on.
6. In Settings > Accessibility > Guided Access, switch it on and set a passcode. Set Display Auto-Lock there so the screen never locks.
7. Until portrait is built, turn Rotation Lock on in Control Center with the iPad in landscape. Then open the app and triple-click the Home button. Under Options, turn off Top Button, Volume Buttons and Motion; leave Keyboards and Touch on. Tap Start. Once portrait is built, turn Rotation Lock off and leave Motion on so the screen can rotate.
8. Leave the iPad on its charger. To exit, triple-click the Home button and enter the passcode.

## Risks and accepted trade-offs

The main accepted risk is that the lists live only on this iPad.

| Risk | Response |
| --- | --- |
| Local-only data. The lists are lost if the Home Screen icon is deleted, the iPad is erased or fails, or the page's web address changes. | Accepted: the content is quick to rewrite. Keep the address fixed by not renaming the GitHub account or repository. |
| Scribble may get in the way of ink. One developer saw fast Pencil strokes dropped on a web canvas until Scribble was switched off ([DEV Community](https://dev.to/skyjinxx/ipados-scribble-interfering-with-apple-pencil-canvas-drawing-in-web-browsers-3ba7)). | Run the device test before the layout is final, because the Add field shares a screen with the ink pad. Fallback: switch Scribble off and add items with the keyboard only. |
| Guided Access may not resume by itself after a flat battery or restart. | Try it during setup and keep the recovery steps on a note beside the iPad. |
| Safari 16 is the ceiling for good. | Avoid newer web features and test on the iPad itself. |
| A battery held at full charge for years can swell. | Keep brightness low and check the case for bulging every few months. |
| A very large ink pad changes shape when the iPad turns, which could crop or shrink the ink. | Settled: ink lives on a fixed page that is scaled to fit and never cropped, so it will show smaller in portrait. Portrait itself is still to be designed. |

## Acceptance checks

The build is done when every check below passes on the iPad itself. Until portrait is built, the portrait parts of these checks wait.

- [ ] Every screen matches the layout agreed in Claude Design, in portrait and landscape.
- [ ] From any screen, a visible control leads back to the home page.
- [ ] An item can be added two ways: Pencil handwriting and the keyboard.
- [ ] A handwritten note is still ink after the app is closed and the iPad restarted.
- [ ] A palm resting on the screen while writing leaves no marks and triggers nothing.
- [ ] Every removal and every Clear can be undone.
- [ ] Turning the iPad between portrait and landscape keeps the same screen, items, half-typed text and ink, with nothing cut off.
- [ ] With Wi-Fi off, the app opens from the Home Screen and everything still works.
- [ ] Five minutes of random tapping, swiping and pinching never leaves the app or loses data.
- [ ] With Guided Access on, the Home button, top button and volume buttons do nothing.
- [ ] After a week left switched on, the lists and notes are still there.
- [ ] Tabs can be added up to six, renamed, and deleted with Confirm, and the home page re-tiles each time.

## Sources

- [iPad Pro (1st generation)](https://en.wikipedia.org/wiki/IPad_Pro_%281st_generation%29), Wikipedia
- [Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), WebKit blog
- [Meet Scribble for iPad](https://developer.apple.com/videos/play/wwdc2020/10106/), Apple Developer
- [Use Guided Access on iPad](https://support.apple.com/guide/ipad/guided-access-ipada16d1374/16.0/ipados/16.0), Apple iPad User Guide for iPadOS 16
- [Dictate text on iPad](https://support.apple.com/guide/ipad/dictate-text-ipad997d9642/16.0/ipados/16.0), Apple iPad User Guide for iPadOS 16
- [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), GitHub Docs
- [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), GitHub Docs
- [iPadOS Scribble Interfering with Apple Pencil Canvas Drawing in Web Browsers](https://dev.to/skyjinxx/ipados-scribble-interfering-with-apple-pencil-canvas-drawing-in-web-browsers-3ba7), DEV Community
