# Research Prompt — Memorization UX & Progression Design

## Context
Use this prompt with a deep research AI (ChatGPT Deep Research, Perplexity, etc.) to inform the design of WolfenWord's progression system, session structure, and engagement tracking.

## The Prompt

I'm building a scripture memorization web app with multiple practice modes (reading, first-letter recognition, typing recall, testing). I need to design the progression system, session structure, and daily engagement tracking. I want to learn from the best — not just Bible apps, but any app that has solved the "learn and retain something through daily practice" problem well.

**Research these apps and their specific mechanics:**

**Language/learning apps:**
- **Duolingo** — How does it structure a daily session? What counts as "completing" a lesson? How does the streak system work (hearts, freeze, repair)? How does it decide what to show you today (skill decay, spaced repetition)? What's the XP system and how does it tie to actual learning vs. gamification theater?
- **Anki / SuperMemo** — How does spaced repetition work at a practical level? How do users rate difficulty and how does that affect scheduling? What are the failure modes (card overload, review fatigue)?
- **WaniKani** — How does it handle staged progression (Apprentice → Guru → Master → Enlightened → Burned)? How many stages are there and what triggers advancement? How does it prevent rushing?
- **Memrise** — How does it blend recognition, recall, and production? What's its session flow?
- **Brilliant.org** — How does it make practice feel like discovery rather than drilling?

**Habit and fitness apps:**
- **Streaks (iOS app)** — How does it handle the psychology of streak maintenance?
- **Strava / fitness apps** — How do they handle activity logging that's automatic vs. manual? How do they visualize consistency over time?
- **GitHub contribution graph** — Why does it work as motivation? What are its known failure modes (gaming the system)?

**Bible/memorization-specific apps:**
- **Memorize by Heart, Verses, Scripture Typer, Fighter Verses, RememberMe** — How do they structure memorization stages? What modes do they offer? How do they handle chapter-level vs. verse-level? What do they get wrong?

**Specifically answer these design questions:**

1. **Session design:** What should "today's session" contain? A fixed number of items? Time-based? Adaptive? How do the best apps decide what you practice today?

2. **Progression model:** What's the optimal number of stages between "never seen" and "fully memorized"? What concrete actions move a verse/passage between stages? How do you handle regression (forgetting)?

3. **Credit and streaks:** What should count as daily engagement? How do top apps prevent low-effort gaming while not punishing genuine but light practice? Do any apps use intensity tiers in their streak visualization?

4. **Passage-level learning:** Most learning apps work with atomic units (a word, a card, a sentence). How do you adapt these patterns for longer content (a chapter, a 10-verse passage)? How do you break it into learnable chunks without losing the cohesion of the whole?

5. **The "what do I do now" problem:** How do the best apps eliminate decision paralysis on login? What's the UX pattern for guiding without prescribing?

6. **Retention without burnout:** How do apps balance review of old material with introduction of new material? What ratio works? How do they prevent the Anki "review pile" problem?

Focus on concrete implementation details, specific UX flows, and design patterns I can steal. Theory is secondary — I want to know what buttons they show, what screens they present, and what triggers they use.
