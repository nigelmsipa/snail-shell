# Snail-Shell — Bible Translation Color System

The canonical mapping of accent color → Bible translation for all Snail-Shell
read-along surfaces (app, YouTube renders, thumbnails). One system, used
everywhere, so a translation always wears the same color.

---

## The principle (why it looks intentional, not random)

The background stays the same cream/paper everywhere. **Only the accent changes**
per translation (title rule, lemma, verse markers, and the highlighter fill
behind the active word).

The single rule that makes a multi-color set read as *one family* instead of a
scatter:

> **Lock saturation and lightness. Vary only the hue.**

Every accent sits on the same muted "shelf" — same S, same L — so they all
harmonize with the paper and with each other automatically. The earlier random
version felt off because the colors varied in *saturation/lightness*: some
popped off the page, some sank into it. Fixing S+L is the whole trick.

- **Accent tone** (rule / lemma / verse marker): `S ≈ 32–40%`, `L ≈ 44–54%`
- **Highlighter fill** (behind active word): same hue, `S ≈ 45%`, `L ≈ 80%`

## The system (why each translation gets *its* hue)

Hue is assigned by the translation's **year of first publication**, walking the
hue wheel **warm → cool**. This makes the color *mean something*: warm/golden =
older lineage, cool/indigo = modern. You can read a Bible's era off its color,
the KJV-family naturally clusters in the warm zone, and adjacent-in-time =
adjacent-in-hue, so the whole library reads as one continuous patina-over-time
gradient.

(Alternative axis considered and rejected: literal↔dynamic *philosophy*. Age won
because it's objective and unarguable; "how literal is it" invites debate.)

---

## The map

| Translation | Year | Hue | Accent HSL | Accent hex | Highlighter HSL | Why this color |
|---|---|---|---|---|---|---|
| Geneva | 1560 | 25° | `hsl(25 38% 52%)` | `#B37D56` | `hsl(25 45% 80%)` | clay/terracotta — oldest, warmest, aged-paper tone |
| **KJV** *(flagship)* | 1611 | 42° | `hsl(42 40% 50%)` | `#B3944D` | `hsl(42 45% 80%)` | warm gold/ochre — happens to fit its "flagship / Batman" role |
| Webster | 1833 | 70° | `hsl(70 32% 48%)` | `#95A653` | `hsl(70 45% 80%)` | olive — first step off the warm anchor |
| YLT | 1862 | 95° | `hsl(95 30% 48%)` | `#749F56` | `hsl(95 45% 80%)` | moss green |
| Smith's Literal | 1876 | 108° | `hsl(108 29% 47%)` | `#639B55` | `hsl(108 43% 80%)` | green |
| English Revised (RV) | 1885 | 116° | `hsl(116 27% 46%)` | `#5A9556` | `hsl(116 43% 80%)` | sage-green |
| Darby | 1890 | 120° | `hsl(120 26% 46%)` | `#579457` | `hsl(120 40% 80%)` | sage green — the wheel's midpoint |
| ASV | 1901 | 150° | `hsl(150 30% 44%)` | `#4F9270` | `hsl(150 42% 80%)` | jade |
| Weymouth NT | 1903 | 152° | `hsl(152 30% 44%)` | `#4F9272` | `hsl(152 43% 80%)` | jade |
| JPS (Tanakh) | 1917 | 160° | `hsl(160 31% 44%)` | `#4D937C` | `hsl(160 43% 80%)` | jade-teal |
| BBE | 1949 | 178° | `hsl(178 32% 44%)` | `#4C9492` | `hsl(178 45% 80%)` | teal — pivot from green to blue |
| MLV | 1987 | 194° | `hsl(194 34% 47%)` | `#4F8EA1` | `hsl(194 43% 80%)` | slate |
| American KJV | 1999 | 198° | `hsl(198 35% 48%)` | `#508CA5` | `hsl(198 43% 80%)` | slate blue (near-twin of WEB — same era) |
| WEB | 2000 | 200° | `hsl(200 35% 48%)` | `#5089A5` | `hsl(200 45% 80%)` | slate blue |
| **BSB** | 2016 | 222° | `hsl(222 38% 52%)` | `#5672B3` | `hsl(222 45% 80%)` | blue — clearly modern |
| LSV | 2020 | 248° | `hsl(248 30% 54%)` | `#7067AD` | `hsl(248 42% 80%)` | indigo |
| MSB | 2022 | 270° | `hsl(270 26% 54%)` | `#8A6BA8` | `hsl(270 40% 80%)` | muted violet — newest, coolest end |

> **Now 17 translations** (added 2026-07-01 from the `*-aligned` dirs): Smith's Literal (1876),
> English Revised / RV (1885), Weymouth NT (1903), JPS Tanakh (1917), MLV (1987), American KJV (1999).
> Each slotted by publication year, hue read off the gradient between neighbors — no new decisions.
> **Open question:** `jps-wey-aligned` pairs JPS (OT, 1917) + Weymouth (NT, 1903) — if they ship as ONE
> combined Bible, they should share a single color, not two. Confirm whether to merge them.
> **Note:** American KJV (1999) lands one hue-tick before WEB (2000) — near-identical slate by design
> (contemporary = adjacent hue). Nudge if two same-era blues need more separation on the shelf.

---

## Code (design tokens)

CSS custom properties — accent + highlighter per translation:

```css
:root {
  /* shared paper background stays constant; only --accent / --hl change */

  --kjv-accent:     hsl(42 40% 50%);   --kjv-hl:     hsl(42 45% 80%);   /* 1611  warm gold */
  --geneva-accent:  hsl(25 38% 52%);   --geneva-hl:  hsl(25 45% 80%);   /* 1560  clay */
  --webster-accent: hsl(70 32% 48%);   --webster-hl: hsl(70 45% 80%);   /* 1833  olive */
  --ylt-accent:     hsl(95 30% 48%);   --ylt-hl:     hsl(95 45% 80%);   /* 1862  moss */
  --darby-accent:   hsl(120 26% 46%);  --darby-hl:   hsl(120 40% 80%);  /* 1890  sage */
  --asv-accent:     hsl(150 30% 44%);  --asv-hl:     hsl(150 42% 80%);  /* 1901  jade */
  --bbe-accent:     hsl(178 32% 44%);  --bbe-hl:     hsl(178 45% 80%);  /* 1949  teal */
  --web-accent:     hsl(200 35% 48%);  --web-hl:     hsl(200 45% 80%);  /* 2000  slate */
  --bsb-accent:     hsl(222 38% 52%);  --bsb-hl:     hsl(222 45% 80%);  /* 2016  blue */
  --lsv-accent:     hsl(248 30% 54%);  --lsv-hl:     hsl(248 42% 80%);  /* 2020  indigo */
  --msb-accent:     hsl(270 26% 54%);  --msb-hl:     hsl(270 40% 80%);  /* 2022  violet */
  /* --- added translations (slotted by year) --- */
  --smiths-accent:  hsl(108 29% 47%);  --smiths-hl:  hsl(108 43% 80%);  /* 1876  Smith's Literal, green */
  --erv-accent:     hsl(116 27% 46%);  --erv-hl:     hsl(116 43% 80%);  /* 1885  English Revised, sage-green */
  --weymouth-accent:hsl(152 30% 44%);  --weymouth-hl:hsl(152 43% 80%);  /* 1903  Weymouth NT, jade */
  --jps-accent:     hsl(160 31% 44%);  --jps-hl:     hsl(160 43% 80%);  /* 1917  JPS Tanakh, jade-teal */
  --mlv-accent:     hsl(194 34% 47%);  --mlv-hl:     hsl(194 43% 80%);  /* 1987  MLV, slate */
  --akjv-accent:    hsl(198 35% 48%);  --akjv-hl:    hsl(198 43% 80%);  /* 1999  American KJV, slate blue */
}
```

JSON (for render scripts / tokens):

```json
{
  "principle": "lock saturation+lightness, vary hue by publication year (warm=old, cool=new)",
  "translations": {
    "geneva":  { "year": 1560, "hue": 25,  "accent": "#B37D56", "highlighter": "hsl(25 45% 80%)" },
    "kjv":     { "year": 1611, "hue": 42,  "accent": "#B3944D", "highlighter": "hsl(42 45% 80%)" },
    "webster": { "year": 1833, "hue": 70,  "accent": "#95A653", "highlighter": "hsl(70 45% 80%)" },
    "ylt":     { "year": 1862, "hue": 95,  "accent": "#749F56", "highlighter": "hsl(95 45% 80%)" },
    "darby":   { "year": 1890, "hue": 120, "accent": "#579457", "highlighter": "hsl(120 40% 80%)" },
    "asv":     { "year": 1901, "hue": 150, "accent": "#4F9270", "highlighter": "hsl(150 42% 80%)" },
    "bbe":     { "year": 1949, "hue": 178, "accent": "#4C9492", "highlighter": "hsl(178 45% 80%)" },
    "web":     { "year": 2000, "hue": 200, "accent": "#5089A5", "highlighter": "hsl(200 45% 80%)" },
    "bsb":     { "year": 2016, "hue": 222, "accent": "#5672B3", "highlighter": "hsl(222 45% 80%)" },
    "lsv":     { "year": 2020, "hue": 248, "accent": "#7067AD", "highlighter": "hsl(248 42% 80%)" },
    "msb":     { "year": 2022, "hue": 270, "accent": "#8A6BA8", "highlighter": "hsl(270 40% 80%)" },
    "smiths":  { "year": 1876, "hue": 108, "accent": "#639B55", "highlighter": "hsl(108 43% 80%)" },
    "erv":     { "year": 1885, "hue": 116, "accent": "#5A9556", "highlighter": "hsl(116 43% 80%)" },
    "weymouth":{ "year": 1903, "hue": 152, "accent": "#4F9272", "highlighter": "hsl(152 43% 80%)" },
    "jps":     { "year": 1917, "hue": 160, "accent": "#4D937C", "highlighter": "hsl(160 43% 80%)" },
    "mlv":     { "year": 1987, "hue": 194, "accent": "#4F8EA1", "highlighter": "hsl(194 43% 80%)" },
    "akjv":    { "year": 1999, "hue": 198, "accent": "#508CA5", "highlighter": "hsl(198 43% 80%)" }
  }
}
```

---

# ⬛ CONSOLIDATION — the single source of truth (added 2026-07-01)

The table above (accent + highlighter per translation) is the **ACCENT axis** and is canonical.
Below is everything else that was scattered across the repo, pulled here.

## The constant field (paper · ink · text states)

The accent changes per translation; **this field is the same on every read-along surface.** It was
never pinned in one place, so it drifted. Recommended canonical values (reconciled from the locked
`kjv-frame-design.html` + the live `build_genesis.py` render):

| Token | Recommended | Notes / what it's for |
|---|---|---|
| paper (bg)        | `#fcfcfc` | off-white. Supersedes the constitution's cream `#f4efe4`. |
| ink (fg)          | ✅ **`#26324f`** (royal navy — chosen 2026-07-01) | body text. Navy + gold = the regal pairing for the *King* James. |
| read (already-read) | `#a39b8b` | text that's been spoken; recedes |
| meta (labels)     | `#9a9388` | metadata / sublines |
| hltext (on wash)  | `#26324f` | text sitting on the highlighter (consistent everywhere) |
| accent (KJV)      | `#B3944D` = `hsl(42 40% 50%)` | per-translation, from the table above |
| highlighter (KJV) | ✅ **`#f4d999`** (chosen 2026-07-01 — the most golden) | active-word wash |

## Where color lives in the repo (audit)

| File | Role | Paper | Ink | KJV highlighter | Status |
|---|---|---|---|---|---|
| `snail-bible-colors.md` / `.html` | **accent constitution** | `#f4efe4` cream | `#2c2722` | `hsl(42 45% 80%)` | ✅ accent canonical; field paper/ink are stale |
| `kjv-frame-design.html` | locked KJV reading frame | `#fcfcfc` | `#2e3440` cool | `hsl(42 45% 82%)` | ✅ closest to "current frame truth" |
| `design-v2.html` / `BRAND_SPEC.md` | the 5-board design deck | `#fcfcfc` | `#2e3440` cool | `#f4d999` (deck) / `#e9d2a2` (reader board) | ⚠️ two highlighter values in one file |
| `build_genesis.py` | the live 4K render | `#fcfcfc` | `#3a3120` warm | `#e9d2a2` | (pre-consolidation snapshot) |
| `kjv-simulator.html` | motion reference | `#fcfcfc` | `#2e3440` | `hsl(42 45% 82%)` + a `#f4d999` variant | ⚠️ two highlighter values |
| `make_youtube.py` THEMES | ~12 paper/ink/type palettes (sepia, ivory, nord, frameb, dark, classic…) | varies | varies | varies | 🗄️ legacy exploration — a SEPARATE system (reading-comfort), superseded by this constitution + a single chosen field. Keep for reference, don't treat as truth. |
| `genesis-01-NORD-NORULE.html` + any `nord`/`frameb` renders | old test renders | `#fcfcfc` | `#2e3440` | **GREEN** `#d6e3c2` | ❌ WRONG — green was the #1 render bug; KJV is gold. Stale, do not reuse. |

## Field decisions — BOTH RESOLVED & PROPAGATED (2026-07-01)

1. ✅ **Ink = royal navy `#26324f`** (deeper/bluer than the old Nord slate `#2e3440`). The near-blacks are
   indistinguishable in body text, but the temperature shows at DISPLAY size — and navy + gold is the regal
   pairing for the *King* James. (Briefly set warm `#3a3120` for palette coherence, then reversed — royal wins.)
   Propagated to `design-v2.html`, `kjv-frame-design.html`, `BRAND_SPEC.md`, `build_genesis.py` (INK + HLTEXT).
2. ✅ **KJV highlighter = `#f4d999`** (most golden). Propagated: `build_genesis.py` (`#e9d2a2`→`#f4d999`),
   `kjv-frame-design.html` (`hsl(42 45% 82%)`→`#f4d999`), `design-v2.html` reader board; deck already used it.

**The full KJV field is now unified everywhere:** paper `#fcfcfc` · ink `#26324f` · read `#a39b8b` ·
meta `#9a9388` · accent `#B3944D` (`hsl(42 40% 50%)`) · highlighter `#f4d999` · hltext `#26324f`.

## How to extend / apply
- Accent + highlighter: read straight off the table above by publication year. MLV still unplaced (slot by year).
- Field (paper/ink/etc.): same values for every translation and every surface — that's the whole point.
