# Fonts — vendored on purpose

These are the four faces the Wolf & The Word boards are built from, stored here
rather than fetched from Google at render time.

**Why.** Every board renderer used to open with a `fonts.googleapis.com` link.
That is an external dependency inside something meant to be finished: the day that
URL changes shape, or the CDN is unreachable, every render silently falls back to
Georgia and the boards stop being the boards. A finished artifact should not be able
to break because of something outside itself.

`wolf-fonts.css` is the Google CSS with every `fonts.gstatic.com` URL rewritten to
a local file. Zero external references. Verified: a board rendered against these is
**pixel-identical** to one rendered against Google — same ink rows, same widths.

## Families

| family | licence |
|---|---|
| DM Serif Display | SIL Open Font License 1.1 |
| IBM Plex Sans | SIL Open Font License 1.1 |
| IBM Plex Mono | SIL Open Font License 1.1 |
| Source Serif 4 | SIL Open Font License 1.1 |

All four are OFL, which explicitly permits redistribution — including bundled in a
repository like this — provided the licence travels with them. See `OFL.txt`.

## Use

```html
<link rel="stylesheet" href="file:///home/nigel/wolf-and-word/assets/fonts/wolf-fonts.css">
```

Renderers pointing here: `render_biay_sample.py`, `render_sequence.py`,
`render_prayer_beat.py`, and `prayer-anim*.html` in the Open Design project.

If the absolute path ever moves, rewrite the `url()` values in `wolf-fonts.css`;
nothing else references the font files directly.
