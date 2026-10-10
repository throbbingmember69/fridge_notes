# Fridge notes display

An always-on fridge board for a 2016 9.7-inch iPad Pro: one offline web page with fridge tabs, a Pencil ink pad per fridge and a free-text list per fridge.

## What is here

- `docs/scope.md` is the scope: requirements, device constraints, build approach, iPad setup and acceptance checks. Build from this.
- `design/Main.dc.html` is the Claude Design prototype (landscape, 1024 × 768 pt): home page, per-tab ink pad screen and list panel in one file. `design/canvas.json` is its canvas index.

## About the prototype

The prototype is a design reference, not the app. It only runs inside the Claude Design canvas, which supplies `support.js` and the `<x-dc>` / `<sc-if>` / `<sc-for>` template runtime. It keeps state in memory and saves nothing.

Take the layout, sizes, colours, copy and interaction rules from it, then build the real app as plain HTML, CSS and JavaScript as `docs/scope.md` describes (`index.html`, `sw.js`, a manifest and an icon, saved to localStorage, targeting Safari 16).

Not yet designed: portrait (768 × 1024 pt) versions of every screen, and how ink stays whole when the pad changes shape. The scope doc does not yet describe the list as a slide-over panel on the ink pad screen, which is how the prototype shows it.
