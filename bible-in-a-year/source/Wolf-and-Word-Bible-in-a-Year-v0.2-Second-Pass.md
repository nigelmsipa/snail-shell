# Wolf & Word Bible-in-a-Year — Complete Second-Pass Proposal v0.2

**Status:** Complete architectural second pass for boundary and global-load review

**Controlling calendar:** 365 days, Genesis through Revelation, with no scene divided

## Executive decision

The first pass preserved literary structure but rationed only 53 days to Matthew–Revelation. The second pass assigns **282 days to the Old Testament and 83 days to the New Testament**. Thirty days are recovered by combining adjacent, complete Old Testament movements whose merged loads remain reasonable; those thirty days are spent at natural New Testament story or scene seams.

This is not a chapter-balancing rewrite. The repository’s underlying stories and scenes remain untouched. Former internal pauses on merged days remain available for the daily orientation card and progress bar.

The Hebrew/Greek word candidate is no longer a field in the core calendar. Word studies and Slow Bible pericopes are separate coordinated overlays keyed by `day_id` and canonical passage, not structural requirements imposed upon the reading plan.

## v0.2 results

- Canonical days: **365**
- Old Testament: **282 days**; New Testament: **83 days**
- Matthew begins: **Day 283 — October 10**
- Total measured KJV words: **790,686**
- Canonical coverage: **31,102 of 31,102 KJV verses; zero omissions and zero duplications**
- New Testament measured words: **180,382** across 83 days, approximately **2,173 words/day**
- v0.1 New Testament pace: approximately **3,403 words/day**
- Heaviest v0.2 day: **Day 311**, Luke 22:1–24:53, **3,568 words / 23.0 min audio**
- Lightest v0.2 day: **Day 227**, Jeremiah 1:1–19, **528 words / 3.4 min audio**
- Boundary review: **180 green, 185 yellow, 0 red**
- Load review: **7 light, 333 normal, 24 elevated, 1 heavy, 0 extreme**

Boundary review and load review are deliberately separate. A yellow endpoint means a strong internal movement deserving scrutiny; it does not mean the day is defective. Repository mapping gaps and textual-overlay notes are also recorded separately rather than turning a structurally sound boundary red.

## Controlling change ledger

### Thirty Old Testament calendar days recovered

These are calendar merges only. Every former internal endpoint remains recorded as orientation metadata, and no repository scene is divided.

| v0.1 days | Combined reference | KJV words | Structural reason |
|---:|---|---:|---|
| 24+25 | Exodus 15:22–18:27 | 2,480 | The wilderness complaints, manna, Sabbath, water from the rock, Amalek, and Jethro’s counsel form one continuous movement of provision and ordered dependence before Sinai. |
| 61+62 | Numbers 33:1–36:13 | 2,968 | The itinerary reaches the plains of Moab, then turns naturally to the land’s boundaries, Levitical cities, refuge, and the final inheritance ruling; the book still ends whole. |
| 63+64 | Deuteronomy 1:1–3:29 | 3,098 | Moses’ first historical rehearsal is heard as a unit: refusal at Kadesh, wilderness consequences, and the victories east of Jordan. |
| 65+66 | Deuteronomy 4:1–6:25 | 3,067 | The covenant summons in Deuteronomy 4 leads directly into the Decalogue, the Shema, and the warning not to forget the LORD. |
| 86+87 | Joshua 22:1–24:33 | 2,939 | The eastern tribes’ altar crisis and Joshua’s farewell both concern covenant unity, exclusive allegiance, and faithful possession of the land. |
| 91+92 | Judges 8:1–9:57 | 2,654 | Abimelech’s violent counterfeit kingship is the direct bitter fruit of Gideon’s household, ephod, and compromised legacy. |
| 100+101 | 1 Samuel 3:1–7:17 | 2,983 | Samuel’s call, the ark’s capture, Dagon’s fall, the ark’s return, and Ebenezer complete the transfer from Eli’s failed house to Samuel’s judgeship. |
| 110+111 | 1 Samuel 27:1–31:13 | 2,945 | David’s Philistine exile, the rescue of Ziklag, and Saul’s death close the old reign and prepare David’s accession without interrupting a scene. |
| 112+113 | 2 Samuel 1:1–4:12 | 3,200 | David’s lament and the ensuing conflict between Saul’s and David’s houses belong to the same transition from one kingdom to another. |
| 125+126 | 1 Kings 5:1–7:51 | 3,027 | The temple’s structure and its furnishings are two phases of the same building movement and end with the completed house. |
| 129+130 | 1 Kings 11:1–12:33 | 2,291 | Solomon’s apostasy produces the judgment announced against his house, and the next chapter shows that judgment taking political form in the schism. |
| 133+134 | 1 Kings 17:1–19:21 | 2,809 | Carmel and Horeb belong together: Elijah’s public triumph is followed by collapse, flight, divine presence, recommissioning, and succession. |
| 140+141 | 2 Kings 6:1–8:29 | 2,796 | The deliverance of Samaria gives way to the rise of Hazael, linking prophetic word, Aramean power, and the next stage of judgment. |
| 145+146 | 2 Kings 15:1–17:41 | 2,993 | The final decline of both kingdoms culminates in the narrator’s full theological explanation of Israel’s exile. |
| 158+159 | 1 Chronicles 21:1–24:31 | 2,741 | The plague-staying altar identifies the future temple site, after which David immediately prepares the house and its ministers. |
| 164+165 | 2 Chronicles 8:1–12:16 | 2,945 | Solomon’s completed glory is followed immediately by the folly that tears his kingdom; the contrast becomes clearer in one sitting. |
| 167+168 | 2 Chronicles 17:1–20:37 | 3,009 | Jehoshaphat’s disastrous alliance is answered by reform, prayer, and deliverance, preserving the complete moral movement. |
| 175+176 | 2 Chronicles 34:1–36:23 | 2,864 | Josiah’s reform and Passover are followed by the irreversible collapse, exile, sabbath-rest of the land, and Cyrus’s decree. |
| 178+179 | Ezra 3:1–6:22 | 2,677 | The stopped foundation and the completed temple are an intentional problem-and-resolution pair joined by the prophetic word. |
| 182+183 | Nehemiah 1:1–4:23 | 2,720 | Nehemiah’s burden, commission, inspection, building, and first opposition form one continuous launch of the wall project. |
| 184+185 | Nehemiah 5:1–7:73 | 2,414 | Internal injustice and external opposition are overcome, the wall is completed, and the census secures the restored community. |
| 186+187 | Nehemiah 8:1–10:39 | 2,666 | The public reading of Torah leads directly to confession and the sealed covenant response. |
| 188+189 | Nehemiah 11:1–13:31 | 2,680 | Resettlement and dedication culminate in joy; the final reforms then close Nehemiah’s memoir with its repeated prayer for remembrance. |
| 192+193 | Esther 6:1–10:3 | 2,548 | The hidden reversal, public victory, rest, Purim, and Mordecai’s exaltation are the complete resolution of Esther’s second half. |
| 194+195 | Job 1:1–7:21 | 3,120 | The heavenly test and earthly losses lead directly into Job’s lament and the first speeches, keeping the crisis with its first attempted interpretation. |
| 196+197 | Job 8:1–14:22 | 2,845 | Bildad and Zophar’s first speeches and Job’s replies complete the first debate cycle without isolating one exchange. |
| 198+199 | Job 15:1–21:34 | 3,046 | The second cycle of speeches is retained as a single escalating movement ending with Job’s answer to his friends. |
| 200+201 | Job 22:1–28:28 | 2,367 | The third exchange leads into the poem on inaccessible wisdom, allowing the failed debate to reach its reflective conclusion. |
| 203+204 | Job 32:1–37:24 | 2,666 | Elihu’s speeches are heard as one sustained intervention and end when he summons Job to stand still before God’s works. |
| 205+206 | Job 38:1–42:17 | 2,445 | God’s speeches, Job’s final answer, vindication, intercession, and restoration form the indivisible conclusion of the book. |

### Thirty days reassigned to the New Testament

| Book or grouping | v0.1 days | v0.2 days | Days added | Governing improvement |
|---|---:|---:|---:|---|
| Matthew | 9 | 11 | +2 | Separates the opposition/parables movement and the identity/community movement at completed scenes. |
| Mark | 5 | 7 | +2 | Gives the long Galilean story four movements before the confession at Caesarea Philippi. |
| Luke | 7 | 11 | +4 | Allows Galilee and the Great Journey to breathe while preserving the passion-resurrection ending. |
| John | 6 | 9 | +3 | Divides the Book of Signs and Farewell Discourse at major completed movements. |
| Acts | 8 | 11 | +3 | Separates Jerusalem, Judea-Samaria, and Paul’s trial sequence at scene endings. |
| Romans | 3 | 5 | +2 | Follows the repository’s doctrinal stories instead of compressing Romans 6–11. |
| 1 Corinthians | 2 | 4 | +2 | Uses the five repository stories as four balanced readings. |
| 2 Corinthians | 2 | 3 | +1 | Divides the long reconciliation story at 3:6/3:7, then keeps giving and apostolic weakness together. |
| Philippians–Colossians | 1 | 2 | +1 | Restores each complete letter to its own day. |
| Thessalonian letters | 1 | 2 | +1 | Restores each complete letter to its own day. |
| Pastoral letters and Philemon | 1 | 3 | +2 | Gives 1 and 2 Timothy separate book-days and pairs Titus with Philemon. |
| Hebrews | 1 | 3 | +2 | Uses the Story C/D and Story D/E seams: 1–7, 8–10, and 11–13. |
| James–1 Peter | 1 | 2 | +1 | Restores each complete letter to its own day. |
| Catholic-letter cluster | 1 | 2 | +1 | Pairs 2 Peter with Jude and keeps the three Johannine letters together. |
| Revelation | 3 | 6 | +3 | Gives the seals, trumpets, dragon-beasts, bowls/Babylon, and final victory/new creation their own movements. |
| **Total** | **53** | **83** | **+30** | **Matthew now begins October 10 rather than November 9.** |

## Complete 365-day controlling calendar

Each record contains the day/date, title, exact reference, included repository structure, movement summary, boundary rationale, endpoint type, measured KJV load, structural review, load review, and source/overlay notes where needed.

### Day 1 — January 1 — Creation, Garden, and Exile

- **Reading:** Genesis 1:1–3:24
- **Included structure:** A1–11; B1–12
- **Daily movement:** God orders the world, forms humanity in his image, gives the garden vocation, and drives the disobedient pair eastward while guarding the way to the tree of life.
- **Why it begins and ends here:** Begins at the Bible’s opening. Ends after judgment and expulsion, the decisive ending of the Eden story rather than at the chapter boundary after creation.
- **Endpoint:** Story
- **KJV load:** 2,124 words; 10.6 min reading; 13.7 min audio
- **Review:** Green boundary; Normal load

### Day 2 — January 2 — Sin at the Door; Grace Before the Flood

- **Reading:** Genesis 4:1–7:16
- **Included structure:** C1–9; D1–9; E1–6; plus currently unmapped 6:1–8
- **Daily movement:** Cain refuses mastery over sin, violence spreads through his line, Seth’s line preserves the name of the LORD, human corruption fills the earth, and Noah enters the ark under divine favor.
- **Why it begins and ends here:** Begins with life east of Eden. Ends when the LORD shuts Noah in: the long preparation closes and the flood itself is poised to begin.
- **Endpoint:** Major Movement
- **KJV load:** 2,109 words; 10.5 min reading; 13.6 min audio
- **Review:** Yellow boundary; Normal load
- **Audit note:** Repository mapping gap retained as a source-data issue; it is not treated as a boundary defect.

### Day 3 — January 3 — The Waters Recede; Covenant Under the Bow

- **Reading:** Genesis 7:17–9:29
- **Included structure:** E7–22
- **Daily movement:** The flood prevails, God remembers Noah, dry land returns, sacrifice rises, and God establishes his covenant with every living creature under the sign of the bow.
- **Why it begins and ends here:** Begins with the waters rising after the ark is sealed. Ends with Noah’s death, completing the flood-and-covenant story.
- **Endpoint:** Story
- **KJV load:** 1,434 words; 7.2 min reading; 9.3 min audio
- **Review:** Green boundary; Normal load

### Day 4 — January 4 — From the Nations to Abram

- **Reading:** Genesis 10:1–13:18
- **Included structure:** F1–8; G1–3; H1–10; plus currently unmapped
- **Daily movement:** The nations spread, Babel’s builders are scattered, Shem’s line narrows to Terah, and Abram obeys the call toward the land God promises.
- **Why it begins and ends here:** Begins with the post-flood nations. Ends at Abram’s altar near Hebron after separation from Lot, completing his first movement into and through the promised land.
- **Endpoint:** Major Movement
- **KJV load:** 2,094 words; 10.5 min reading; 13.5 min audio
- **Review:** Yellow boundary; Normal load
- **Audit note:** Repository mapping gap retained as a source-data issue; it is not treated as a boundary defect.

### Day 5 — January 5 — The Covenant Cut and Sealed

- **Reading:** Genesis 14:1–17:27
- **Included structure:** H11–29
- **Daily movement:** Abram rescues Lot, receives blessing from Melchizedek, believes God’s promise, passes through the covenant-cutting rite, and receives circumcision as its sign.
- **Why it begins and ends here:** Begins with the crisis that draws Abram into royal conflict. Ends when circumcision is performed that very day, sealing the covenant movement.
- **Endpoint:** Major Movement
- **KJV load:** 2,168 words; 10.8 min reading; 14.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 6 — January 6 — Shall Not the Judge of All the Earth Do Right?

- **Reading:** Genesis 18:1–20:18
- **Included structure:** H30–51
- **Daily movement:** The promised son is reaffirmed, Abraham intercedes for the cities, Sodom falls, Lot is delivered, and God protects Sarah in Gerar despite Abraham’s failure.
- **Why it begins and ends here:** Begins with the LORD’s visit and the announcement that frames the Sodom episode. Ends with Abimelech’s restoration and Abraham settled in the land, closing the judgment-and-preservation movement.
- **Endpoint:** Major Movement
- **KJV load:** 2,473 words; 12.4 min reading; 16.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 7 — January 7 — The Son, the Test, and the First Piece of Canaan

- **Reading:** Genesis 21:1–23:20
- **Included structure:** H52–69
- **Daily movement:** Isaac is born, Hagar and Ishmael are preserved, Abraham is tested at Moriah, and Sarah’s burial place becomes the family’s first legally held ground in Canaan.
- **Why it begins and ends here:** Begins with fulfillment of the promised birth. Ends with the secured burial field, a quiet but concrete land-promise milestone after Sarah’s death.
- **Endpoint:** Major Movement
- **KJV load:** 1,942 words; 9.7 min reading; 12.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 8 — January 8 — A Bride for Isaac; Abraham Gathered to His People

- **Reading:** Genesis 24:1–25:18
- **Included structure:** H70–86; plus currently unmapped 25:12–18
- **Daily movement:** Abraham’s servant is providentially guided to Rebekah, Isaac receives his bride, Abraham dies and is buried, and Ishmael’s line is recorded.
- **Why it begins and ends here:** Begins with the succession-critical search for Isaac’s wife. Ends after Abraham’s death and Ishmael’s genealogy, clearing the narrative for Jacob and Esau.
- **Endpoint:** Major Movement
- **KJV load:** 2,174 words; 10.9 min reading; 14.0 min audio
- **Review:** Yellow boundary; Normal load
- **Audit note:** Repository mapping gap retained as a source-data issue; it is not treated as a boundary defect.

### Day 9 — January 9 — Birthright and Blessing

- **Reading:** Genesis 25:19–27:40
- **Included structure:** I1–19
- **Daily movement:** The twins struggle before birth, Esau despises his birthright, Isaac repeats Abraham’s failures and receives covenant promises, and Jacob takes the paternal blessing.
- **Why it begins and ends here:** Begins the Jacob–Esau story. Ends with the blessing irreversibly bestowed and Esau’s murderous resolve exposed.
- **Endpoint:** Major Movement
- **KJV load:** 2,310 words; 11.6 min reading; 14.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 10 — January 10 — Flight, Bethel, and the Bride Exchange

- **Reading:** Genesis 27:41–29:30
- **Included structure:** I20–31
- **Daily movement:** Jacob flees Esau, meets God at Bethel, reaches Laban’s household, and is deceived into marrying Leah before Rachel.
- **Why it begins and ends here:** Begins with the threat that sends Jacob into exile. Ends after the marriage exchange is completed, before the contest of children and households begins.
- **Endpoint:** Major Movement
- **KJV load:** 1,500 words; 7.5 min reading; 9.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 11 — January 11 — Children, Flocks, and the Boundary at Mizpah

- **Reading:** Genesis 29:31–31:55
- **Included structure:** I32–55
- **Daily movement:** God sees Leah, Jacob’s household multiplies, his flocks prosper, and he escapes Laban before a covenant boundary is established at Mizpah.
- **Why it begins and ends here:** Begins with the childbearing rivalry created by the marriages. Ends with Laban’s farewell beyond the covenant cairn, completing Jacob’s separation from Mesopotamia.
- **Endpoint:** Major Movement
- **KJV load:** 2,579 words; 12.9 min reading; 16.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 12 — January 12 — The Man Who Became Israel

- **Reading:** Genesis 32:1–35:29
- **Included structure:** I56–83
- **Daily movement:** Jacob prepares to meet Esau, wrestles through the night and is renamed Israel, reconciles with his brother, survives Shechem’s violence, returns to Bethel, and buries Isaac.
- **Why it begins and ends here:** Begins as Jacob re-enters the land under threat. Ends with Isaac’s death and burial by both sons, completing the Jacob–Esau story arc.
- **Endpoint:** Story
- **KJV load:** 2,756 words; 13.8 min reading; 17.8 min audio
- **Review:** Green boundary; Normal load

### Day 13 — January 13 — Esau’s Generations; Joseph Sold; Judah Exposed

- **Reading:** Genesis 36:1–38:30
- **Included structure:** J1–9; K1–15
- **Daily movement:** Esau’s line is completed, Joseph’s dreams provoke his sale into Egypt, and Judah’s failure with Tamar exposes the family’s moral fracture while preserving its line.
- **Why it begins and ends here:** Begins with the final Esau genealogy before the Joseph story. Ends with Perez’s birth, resolving the self-contained Judah–Tamar interruption before returning to Joseph.
- **Endpoint:** Major Movement
- **KJV load:** 2,606 words; 13.0 min reading; 16.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 14 — January 14 — The LORD Was with Joseph—Yet He Was Forgotten

- **Reading:** Genesis 39:1–40:23
- **Included structure:** K16–26
- **Daily movement:** Joseph prospers in Potiphar’s house, resists sexual coercion, is falsely imprisoned, interprets two royal dreams, and remains forgotten.
- **Why it begins and ends here:** Begins with Joseph alone in Egypt. Ends on the cupbearer’s failure to remember him, the story’s designed low point before reversal.
- **Endpoint:** Major Movement
- **KJV load:** 1,246 words; 6.2 min reading; 8.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 15 — January 15 — From Prison to Power—and the Brothers Return

- **Reading:** Genesis 41:1–42:38
- **Included structure:** K27–49
- **Daily movement:** Pharaoh’s dreams lift Joseph from prison to authority, famine brings his brothers to Egypt, and their first journey ends with Simeon detained and Jacob refusing Benjamin.
- **Why it begins and ends here:** Begins when Pharaoh’s dreams trigger Joseph’s reversal. Ends at the impasse in Canaan after the brothers’ first test and return.
- **Endpoint:** Major Movement
- **KJV load:** 2,381 words; 11.9 min reading; 15.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 16 — January 16 — Judah Stands in Benjamin’s Place

- **Reading:** Genesis 43:1–44:34
- **Included structure:** K50–64
- **Daily movement:** The brothers return with Benjamin, dine in Joseph’s house, are tested by the silver cup, and Judah offers himself in Benjamin’s place.
- **Why it begins and ends here:** Begins when renewed famine forces the second journey. Ends with Judah’s climactic substitution speech, immediately before Joseph can no longer restrain himself.
- **Endpoint:** Major Movement
- **KJV load:** 1,812 words; 9.1 min reading; 11.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 17 — January 17 — ‘I Am Joseph’: Israel Comes Down to Egypt

- **Reading:** Genesis 45:1–47:31
- **Included structure:** K65–88
- **Daily movement:** Joseph reveals himself, interprets the family’s suffering as God’s preservation, brings Jacob to Egypt, and settles Israel in Goshen during the famine.
- **Why it begins and ends here:** Begins with Joseph’s revelation, the emotional answer to Judah’s plea. Ends with Jacob’s burial oath, framing Egypt as refuge but not final home.
- **Endpoint:** Major Movement
- **KJV load:** 2,462 words; 12.3 min reading; 15.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 18 — January 18 — Blessings, Burials, and the Bones

- **Reading:** Genesis 48:1–50:26
- **Included structure:** K89–111
- **Daily movement:** Jacob adopts and blesses Joseph’s sons, speaks over all twelve sons, is buried in Canaan, and Joseph dies in faith that God will visit Israel and carry up his bones.
- **Why it begins and ends here:** Begins with the final blessing cycle. Ends at the book’s final verse with Joseph’s coffin in Egypt and his oath pointing forward to Exodus.
- **Endpoint:** Book
- **KJV load:** 2,092 words; 10.5 min reading; 13.5 min audio
- **Review:** Green boundary; Normal load

### Day 19 — January 19 — The God Who Heard Their Cry

- **Reading:** Exodus 1:1–4:31
- **Included structure:** A1–26
- **Daily movement:** Israel is enslaved, Moses is preserved and exiled, God remembers his covenant, reveals his name at the bush, answers Moses’ objections, and sends him back to a believing, worshiping people.
- **Why it begins and ends here:** Begins with the names linking Exodus to Genesis. Ends when Israel believes and worships at 4:31, completing Moses’ call and return before the confrontation with Pharaoh.
- **Endpoint:** Major Movement
- **KJV load:** 2,796 words; 14.0 min reading; 18.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 20 — January 20 — Who Is the LORD?

- **Reading:** Exodus 5:1–7:13
- **Included structure:** A27–42
- **Daily movement:** Pharaoh rejects the LORD and increases the workload; God answers with covenant promises, establishes Moses and Aaron’s lineage, and authenticates them before the king.
- **Why it begins and ends here:** Begins with the first demand to let Israel go. Ends with Pharaoh hardened after the staff-sign at 7:13, the threshold immediately before the plague cycle.
- **Endpoint:** Major Movement
- **KJV load:** 1,645 words; 8.2 min reading; 10.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 21 — January 21 — That You May Know

- **Reading:** Exodus 7:14–9:35
- **Included structure:** A43–61
- **Daily movement:** The LORD strikes Egypt from blood through hail, distinguishes his people, overcomes the magicians, and repeatedly exposes Pharaoh’s resistant heart.
- **Why it begins and ends here:** Begins with the first plague. Ends after hail when Pharaoh confesses, the storm stops, and he hardens again—a strong internal cadence after plague seven.
- **Endpoint:** Major Movement
- **KJV load:** 2,312 words; 11.6 min reading; 14.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 22 — January 22 — Passover: A Night Much to Be Observed

- **Reading:** Exodus 10:1–12:51
- **Included structure:** A62–82
- **Daily movement:** Locusts and darkness prepare the final blow; Passover is instituted, the firstborn die, and Israel departs with the ordinance of remembrance.
- **Why it begins and ends here:** Begins with the final triad of plagues. Ends at 12:51: on that very day the LORD brings Israel out, the decisive deliverance endpoint.
- **Endpoint:** Major Movement
- **KJV load:** 2,716 words; 13.6 min reading; 17.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 23 — January 23 — Stand Still and See the Salvation of the LORD

- **Reading:** Exodus 13:1–15:21
- **Included structure:** A83–99
- **Daily movement:** The firstborn are consecrated, God leads by cloud and fire, Israel crosses the sea, Egypt’s army falls, and Moses and Miriam sing the victory.
- **Why it begins and ends here:** Begins with consecration after departure. Ends with Miriam’s refrain and dance, the liturgical completion of the sea deliverance.
- **Endpoint:** Major Movement
- **KJV load:** 2,126 words; 10.6 min reading; 13.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 24 — January 24 — Bread, Water, Victory, and Wise Counsel

- **Reading:** Exodus 15:22–18:27
- **Included structure:** A100–108; A109–118
- **Daily movement:** Bitter water is healed, Israel grumbles for food, and God gives quail, manna, Sabbath rest, and a preserved memorial portion. God supplies water from the rock, grants victory over Amalek, receives Jethro’s worship, and gives Moses a wiser structure of shared judgment.
- **Why it begins and ends here:** The wilderness complaints, manna, Sabbath, water from the rock, Amalek, and Jethro’s counsel form one continuous movement of provision and ordered dependence before Sinai. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,480 words; 12.4 min reading; 16.0 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 24 and 25.

### Day 25 — January 25 — A Kingdom of Priests at the Mountain

- **Reading:** Exodus 19:1–20:26
- **Included structure:** B1–11
- **Daily movement:** Israel arrives at Sinai, is named God’s treasured possession and priestly kingdom, witnesses the theophany, hears the Ten Words, and receives altar instructions.
- **Why it begins and ends here:** Begins with arrival at Sinai. Ends after the Decalogue and its immediate altar law at 20:26, before the detailed covenant judgments.
- **Endpoint:** Major Movement
- **KJV load:** 1,263 words; 6.3 min reading; 8.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 26 — January 26 — Justice, Mercy, and the Blood of the Covenant

- **Reading:** Exodus 21:1–24:18
- **Included structure:** B12–40
- **Daily movement:** The covenant judgments order Israel’s social life, the people consent, blood seals the covenant, the elders behold God and eat, and Moses enters the cloud.
- **Why it begins and ends here:** Begins with the Book of the Covenant. Ends at 24:18 with Moses inside the cloud, completing the Sinai covenant story and transitioning to dwelling instructions.
- **Endpoint:** Story
- **KJV load:** 3,003 words; 15.0 min reading; 19.4 min audio
- **Review:** Green boundary; Elevated load

### Day 27 — January 27 — Make Me a Sanctuary

- **Reading:** Exodus 25:1–27:21
- **Included structure:** C1–24
- **Daily movement:** God calls for willing offerings and gives the pattern for the ark, mercy seat, table, lampstand, tent, veil, bronze altar, court, and continual light.
- **Why it begins and ends here:** Begins with the sanctuary purpose and offering. Ends with the continual lamp, completing the dwelling’s architecture and furnishings before priestly vestments.
- **Endpoint:** Major Movement
- **KJV load:** 2,421 words; 12.1 min reading; 15.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 28 — January 28 — Holy to the LORD

- **Reading:** Exodus 28:1–29:46
- **Included structure:** C25–45
- **Daily movement:** Aaron and his sons receive holy garments, are consecrated through washing, anointing, blood, and offerings, and are appointed to serve where God promises to dwell.
- **Why it begins and ends here:** Begins with priestly garments. Ends at 29:46 with the theological purpose—Israel will know the LORD who dwells among them—completing the priestly consecration unit.
- **Endpoint:** Major Movement
- **KJV load:** 2,576 words; 12.9 min reading; 16.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 29 — January 29 — The Holy Things and the Sabbath Sign

- **Reading:** Exodus 30:1–31:18
- **Included structure:** C46–57
- **Daily movement:** Instructions cover incense, atonement money, washing, anointing oil, sacred incense, Spirit-gifted artisans, the Sabbath sign, and the stone tablets.
- **Why it begins and ends here:** Begins with the remaining holy implements and rites. Ends with the tablets written by God, the formal close of the dwelling-instructions story.
- **Endpoint:** Story
- **KJV load:** 1,408 words; 7.0 min reading; 9.1 min audio
- **Review:** Green boundary; Normal load

### Day 30 — January 30 — Show Me Thy Glory

- **Reading:** Exodus 32:1–34:35
- **Included structure:** D1–23
- **Daily movement:** Israel makes the golden calf, Moses shatters the tablets and intercedes, God’s presence is contested and promised, the divine name is proclaimed, the covenant is renewed, and Moses’ face shines.
- **Why it begins and ends here:** Begins with the covenant breach and includes the whole breach-and-renewal story. Ends with the radiant mediator after renewed tablets, an unmistakable story ending.
- **Endpoint:** Story
- **KJV load:** 2,807 words; 14.0 min reading; 18.1 min audio
- **Review:** Green boundary; Normal load

### Day 31 — January 31 — Whose Heart Stirred Him Up

- **Reading:** Exodus 35:1–37:29
- **Included structure:** E1–22
- **Daily movement:** The people bring more than enough, Spirit-gifted artisans begin the work, and the tent with its interior holy furnishings is constructed according to the pattern.
- **Why it begins and ends here:** Begins with Sabbath and the freewill offering. Ends after the incense altar and sacred mixtures, completing the interior sanctuary before bronze court work and final accounting.
- **Endpoint:** Major Movement
- **KJV load:** 2,450 words; 12.2 min reading; 15.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 32 — February 1 — The Glory Filled the Tabernacle

- **Reading:** Exodus 38:1–40:38
- **Included structure:** E23–51
- **Daily movement:** The bronze court is finished, materials are inventoried, priestly garments are completed, Moses inspects and erects the dwelling, and the glory fills it under cloud and fire.
- **Why it begins and ends here:** Begins with the outer altar and court. Ends at Exodus 40:38, the book ending: God’s dwelling presence now leads Israel on all their journeys.
- **Endpoint:** Book
- **KJV load:** 2,683 words; 13.4 min reading; 17.3 min audio
- **Review:** Green boundary; Normal load

### Day 33 — February 2 — The Way Near: Ascent, Gift, and Peace

- **Reading:** Leviticus 1:1–3:17
- **Included structure:** Story A, scenes 1–13
- **Daily movement:** Begins with the LORD speaking from the tabernacle, directly answering the access problem left at Exodus 40. The burnt, grain, and peace offerings provide ordered approaches of surrender, tribute, and fellowship. It ends after the complete catalog of voluntary offerings and the concluding prohibition concerning fat and blood. Chapter 4 begins the required remedies for sin and guilt.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,522 words; 7.6 min reading; 9.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 34 — February 3 — Sin Brought to Light; Guilt Made Right

- **Reading:** Leviticus 4:1–6:7
- **Included structure:** Story A, scenes 14–27
- **Daily movement:** Begins with the transition from voluntary offerings to sacrifices required when sin or guilt becomes known. The movement proceeds through purification offerings, confession, economic accommodation, guilt against holy things, restitution, and forgiveness. It ends at 6:7 after the offender’s responsibility has been fully addressed. Verse 8 changes the audience and turns to priestly administration.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,095 words; 10.5 min reading; 13.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 35 — February 4 — The Fire Must Never Go Out

- **Reading:** Leviticus 6:8–7:38
- **Included structure:** Story A, scenes 28–40
- **Daily movement:** Begins with the new command addressed to Aaron and his sons. The priests receive instructions for maintaining the altar fire and administering each sacrifice. It ends with the formal summary in 7:37–38, which names the offerings and closes the entire sacrificial manual.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,733 words; 8.7 min reading; 11.2 min audio
- **Review:** Green boundary; Normal load

### Day 36 — February 5 — Glory and Strange Fire

- **Reading:** Leviticus 8:1–10:20
- **Included structure:** Story B, scenes 1–22
- **Daily movement:** Begins with the public consecration of Aaron and his sons. Their ministry is inaugurated, the glory appears, and fire from the LORD consumes the offering; unauthorized fire then consumes Nadab and Abihu. It ends when Aaron’s explanation concerning the uneaten offering satisfies Moses, resolving the immediate crisis of the new priesthood.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,240 words; 11.2 min reading; 14.5 min audio
- **Review:** Green boundary; Normal load

### Day 37 — February 6 — Distinguishing Clean from Unclean

- **Reading:** Leviticus 11:1–12:8
- **Included structure:** Story C, scenes 1–13
- **Daily movement:** Begins the purity laws after the priests are commanded to distinguish holy from common and clean from unclean. Israel learns how animals, carcasses, and childbirth affect ritual status and access to sacred space. It ends after the mother’s purification and restoration, before the longer diagnostic movement concerning serious surface afflictions.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,377 words; 6.9 min reading; 8.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 38 — February 7 — The Priest Shall Look

- **Reading:** Leviticus 13:1–59
- **Included structure:** Story C, scenes 14–27
- **Daily movement:** Begins the diagnostic procedures for afflictions affecting skin, hair, wounds, burns, heads, and garments. Observation, isolation, waiting, and re-examination guard against careless judgment. It ends with the formal summary concerning contaminated garments. Chapter 14 changes from diagnosis to cleansing and restoration.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,857 words; 9.3 min reading; 12.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 39 — February 8 — Cleansed and Restored to the Camp

- **Reading:** Leviticus 14:1–15:33
- **Included structure:** Story C, scenes 28–48
- **Daily movement:** Begins when diagnosis gives way to cleansing and restoration. Healed persons and houses are reintegrated through washing, sacrifice, blood, oil, priestly examination, and declaration; the bodily-discharge laws then address another source of impurity. It ends with the formal purpose and summary at 15:31–33: Israel must not defile God’s dwelling in its midst.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,632 words; 13.2 min reading; 17.0 min audio
- **Review:** Green boundary; Normal load

### Day 40 — February 9 — Once a Year: Atonement for All Israel

- **Reading:** Leviticus 16:1–34
- **Included structure:** Story D, scenes 1–9
- **Daily movement:** Begins by recalling the deaths of Nadab and Abihu and the danger of entering God’s presence. Aaron enters by the appointed procedure; the sanctuary is purged, confessed sins are carried into the wilderness, and atonement is made for priesthood, people, and holy place. It ends with the annual ordinance performed as the LORD commanded. The chapter remains alone because it is Leviticus’s central solution.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,157 words; 5.8 min reading; 7.5 min audio
- **Review:** Green boundary; Normal load

### Day 41 — February 10 — Be Holyand Love Your Neighbor

- **Reading:** Leviticus 17:1–19:37
- **Included structure:** Story E, scenes 1–20
- **Daily movement:** Begins the Holiness Code with sacrifice, blood, and the sacredness of life. Holiness then moves from the sanctuary into sexuality, economics, justice, speech, agriculture, family life, treatment of foreigners, and love of neighbor. It ends with the command to observe all the LORD’s statutes and judgments, completing the movement from sacred worship to sacred society.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,118 words; 10.6 min reading; 13.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 42 — February 11 — Holy Priests, Holy Gifts, Holy Name

- **Reading:** Leviticus 20:1–22:33
- **Included structure:** Story E, scenes 21–39
- **Daily movement:** Begins with covenant sanctions corresponding to the commands of chapters 18–19. Israel must remain distinct from the nations; priests must guard their consecration; worshipers and sacrifices must honor the holiness of God’s name. It ends with the command not to profane that name and the reminder that the LORD brought Israel out of Egypt to be their God.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,302 words; 11.5 min reading; 14.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 43 — February 12 — The LORD’s Appointed Timesand the Name

- **Reading:** Leviticus 23:1–24:23
- **Included structure:** Story E, scenes 40–55
- **Daily movement:** Begins with Sabbath and the appointed annual assemblies that order Israel’s sacred time. The lamps and bread represent continual sanctuary service; the blasphemy incident then tests how the holy name and equal justice are to be guarded. It ends when the judgment is carried out, completing the narrative and legal movement.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,773 words; 8.9 min reading; 11.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 44 — February 13 — Liberty Throughout the Land

- **Reading:** Leviticus 25:1–55
- **Included structure:** Story E, scenes 56–68
- **Daily movement:** Begins with Sabbath rest for the land and proceeds through Jubilee, restored inheritance, economic justice, relief of poverty, servitude, and redemption. It ends with the theological basis for the whole system: the Israelites belong to the LORD because he brought them out of Egypt.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,532 words; 7.7 min reading; 9.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 45 — February 14 — Covenant, Vows, and the Last Word from Sinai

- **Reading:** Leviticus 26:1–27:34
- **Included structure:** Story E, scenes 69–79; Story F, scenes 1–9
- **Daily movement:** Begins with the covenant’s blessings, escalating judgments, confession, and the LORD’s promise to remember his covenant. Chapter 27 then regulates voluntary vows, valuations, devoted property, and redemption. It ends with the commandments given through Moses at Sinai. The short appendix remains with the covenant conclusion so the final day reaches the book ending naturally.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 2,203 words; 11.0 min reading; 14.2 min audio
- **Review:** Green boundary; Normal load

### Day 46 — February 15 — Counted and Camped Around the Presence

- **Reading:** Numbers 1:1–2:34
- **Included structure:** Story A, scenes 1–22
- **Daily movement:** Begins with the book’s dated opening at Sinai and the command to count Israel’s fighting men. The tribes are numbered, the Levites are set apart, and the camp is arranged around the tabernacle with Judah leading the march. It ends with the summary that Israel camped and marched according to the LORD’s command, completing the ordered camp.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,161 words; 10.8 min reading; 13.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 47 — February 16 — The Levites Between Wrath and the Camp

- **Reading:** Numbers 3:1–4:49
- **Included structure:** Story A, scenes 23–46
- **Daily movement:** Begins with Aaron’s surviving priestly line after the deaths of Nadab and Abihu. The Levites are taken in place of Israel’s firstborn, arranged around the sanctuary, assigned their sacred loads, and warned against careless contact with the holy things. It ends with the complete census of 8,580 Levite workers, each assigned his service and burden.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,707 words; 13.5 min reading; 17.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 48 — February 17 — Purity, Consecration, and the Blessing

- **Reading:** Numbers 5:1–6:27
- **Included structure:** Story A, scenes 47–59
- **Daily movement:** Begins with the removal of impurity from the camp where God dwells. Restitution addresses public wrong, the jealousy procedure submits hidden guilt to divine judgment, and the Nazirite vow opens special consecration to ordinary Israelites. It ends with the priestly blessing placing the LORD’s name upon Israel—the theological climax of the camp-purity movement.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,640 words; 8.2 min reading; 10.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 49 — February 18 — Twelve Tribes, One Dedication

- **Reading:** Numbers 7:1–89
- **Included structure:** Story A, scenes 60–76
- **Daily movement:** Begins with the tribal leaders bringing carts and oxen for the tabernacle’s service. Each leader then receives an undiminished place in the twelve-day altar dedication. It ends after the grand total when Moses enters the tent and hears the voice speaking from above the mercy seat. The ordered sanctuary system is now functioning with God present in the camp.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,939 words; 9.7 min reading; 12.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 50 — February 19 — At the LORD’s Command They Set Out

- **Reading:** Numbers 8:1–10:10
- **Included structure:** Story A, scenes 77–90
- **Daily movement:** Begins with the lamps and the purification and presentation of the Levites. Israel keeps Passover, provision is made for those unable to keep it at the appointed time, and the cloud directs every movement and delay. It ends with the silver trumpets that summon the assembly, announce departure, sound in battle, and accompany worship. The camp is completely prepared to leave Sinai.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,684 words; 8.4 min reading; 10.9 min audio
- **Review:** Green boundary; Normal load

### Day 51 — February 20 — Would God That All the LORD’s People Were Prophets

- **Reading:** Numbers 10:11–12:16
- **Included structure:** Story B, scenes 1–19
- **Daily movement:** Begins when the cloud lifts and Israel finally departs Sinai. The ark leads the march, but complaint, craving, fire, quail, and plague quickly expose the people’s disorder. The Spirit rests upon the seventy elders, while Miriam and Aaron challenge Moses and Miriam is struck. It ends after her seven-day exclusion, restoration, and the camp’s departure from Hazeroth.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,056 words; 10.3 min reading; 13.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 52 — February 21 — The Land Was Good; the People Would Not Enter

- **Reading:** Numbers 13:1–14:45
- **Included structure:** Story B, scenes 20–39
- **Daily movement:** Begins with the command to investigate Canaan. The spies confirm the land’s abundance, but ten transform danger into despair while Caleb and Joshua call Israel to faith. The people refuse the land, threaten new leadership, and face the forty-year sentence. It ends when the condemned people attempt conquest without the LORD and are defeated, completing the rebellion and its immediate consequence.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,922 words; 9.6 min reading; 12.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 53 — February 22 — Presumptuous Sin and the Rebellion of Korah

- **Reading:** Numbers 15:1–16:50
- **Included structure:** Story B, scenes 40–58
- **Daily movement:** Begins with laws for Israel’s future life in the land, quietly affirming that God’s promise survives the present generation’s failure. Unintentional and defiant sin are distinguished, the Sabbath breaker is judged, and tassels are commanded as visible reminders. Korah’s revolt then challenges the priesthood. It ends when Aaron stands between the dead and the living and the plague is stopped.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,409 words; 12.0 min reading; 15.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 54 — February 23 — The Budded Staff and the Guarded Sanctuary

- **Reading:** Numbers 17:1–19:22
- **Included structure:** Story B, scenes 59–75
- **Daily movement:** Begins with the test of the twelve staffs. Aaron’s staff buds, blossoms, and bears almonds, confirming the chosen priesthood after Korah’s rebellion. Priestly and Levitical responsibilities are restated, their provisions are secured, and the red-heifer ordinance supplies cleansing from death’s impurity. It ends with the completed purification law and its warning against defiling the sanctuary.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,130 words; 10.7 min reading; 13.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 55 — February 24 — Moses Strikes the Rock; Aaron Dies; Israel Advances

- **Reading:** Numbers 20:1–21:35
- **Included structure:** Story B, scenes 76–89
- **Daily movement:** Begins with Miriam’s death and another water crisis. Moses fails to sanctify the LORD before the people, Edom refuses passage, and Aaron dies on Mount Hor. The new movement then advances through the bronze serpent, the journey song, and victories over Sihon and Og. It ends with Bashan defeated and Israel occupying the territory east of Jordan.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,723 words; 8.6 min reading; 11.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 56 — February 25 — A Donkey Sees; a Prophet Blesses

- **Reading:** Numbers 22:1–24:25
- **Included structure:** Story B, scenes 90–110
- **Daily movement:** Begins when Balak sees Israel encamped in Moab and hires Balaam to curse them. Balaam’s donkey sees what the seer cannot, the LORD controls Balaam’s mouth, and repeated attempts to curse Israel produce escalating blessings and visions of future victory. It ends with Balaam and Balak separating after the final oracle.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,603 words; 13.0 min reading; 16.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 57 — February 26 — After the Plague: A New Generation for the Land

- **Reading:** Numbers 25:1–27:23
- **Included structure:** Story B, scenes 111–114; Story C, scenes 1–22
- **Daily movement:** Begins with Israel’s apostasy at Baal Peor, the final collapse of the wilderness generation. Phinehas stops the plague and receives a covenant of peace. “After the plague,” the second census counts the generation that will inherit the land; Zelophehad’s daughters secure an inheritance ruling, and Joshua is commissioned before the congregation. It ends with Moses laying his hands upon his successor.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,501 words; 12.5 min reading; 16.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 58 — February 27 — Offerings in Their Appointed Season; Vows Kept

- **Reading:** Numbers 28:1–30:16
- **Included structure:** Story C, scenes 23–40
- **Daily movement:** Begins with the continual daily offering and expands through Sabbath, new-moon, Passover, Weeks, Trumpets, Atonement, and Booths. Sacred time is ordered for the generation entering the land. The laws of vows then establish the weight of the spoken word and the household procedures governing commitments. It ends with the summary of the vow ordinances given through Moses.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,236 words; 11.2 min reading; 14.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 59 — February 28 — Vengeance, Purification, and a Possession East of Jordan

- **Reading:** Numbers 31:1–32:42
- **Included structure:** Story C, scenes 41–61
- **Daily movement:** Begins with the campaign against Midian, the final task assigned to Moses before his death. Balaam is killed, the camp and spoils are purified, and tribute is given to the LORD. Reuben and Gad then request the conquered eastern territory. It ends after they pledge to cross armed before Israel and the Transjordan settlements are assigned and rebuilt.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,217 words; 11.1 min reading; 14.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 60 — March 1 — From the Wilderness Stages to an Inheritance Preserved

- **Reading:** Numbers 33:1–36:13
- **Included structure:** Story C, scenes 62–82; Story C, scenes 83–93
- **Daily movement:** Begins with Moses’ written record of Israel’s stages from Egypt to Moab. The itinerary turns memory into preparation: the inhabitants and idols must be removed, the land must be possessed, and failure will reverse the intended judgment. It ends after Canaan’s boundaries and the leaders responsible for distributing the inheritance are named. Begins with provision for the Levites within Israel’s inheritance. The cities of refuge distinguish murder from accidental killing, constrain vengeance, and prevent bloodshed from polluting the land. The Zelophehad ruling is then completed by preserving each tribe’s inheritance through marriage within the clan. It ends with the book’s geographical and legal colophon on the plains of Moab opposite Jericho.
- **Why it begins and ends here:** The itinerary reaches the plains of Moab, then turns naturally to the land’s boundaries, Levitical cities, refuge, and the final inheritance ruling; the book still ends whole. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Book
- **KJV load:** 2,968 words; 14.8 min reading; 19.1 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 61 and 62.

### Day 61 — March 2 — You Would Not Go Up—Yet the LORD Gave the Land

- **Reading:** Deuteronomy 1:1–3:29
- **Included structure:** Story A, scenes 1–12; Story A, scenes 13–28
- **Daily movement:** Begins with the book’s formal setting on the plains of Moab and Moses beginning to explain the law. His historical sermon returns to Horeb, the appointment of judges, the spies’ good report, Israel’s refusal to enter, and the presumptuous attack after judgment. It ends with Israel remaining at Kadesh after defeat, completing the first generation’s decisive failure. Begins with Israel’s long circling of Mount Seir. The condemned generation passes away, peaceful boundaries are respected, and the LORD begins giving Israel victory over Sihon and Og. The eastern land is distributed, Moses is denied entry, and Joshua is commissioned. It ends with Israel encamped opposite Beth-peor after Moses views the land from Pisgah.
- **Why it begins and ends here:** Moses’ first historical rehearsal is heard as a unit: refusal at Kadesh, wilderness consequences, and the victories east of Jordan. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 3,098 words; 15.5 min reading; 20.0 min audio
- **Review:** Yellow boundary; Elevated load
- **v0.2 change:** Combines v0.1 Days 63 and 64.

### Day 62 — March 3 — Take Heed, Hear O Israel, and Do Not Forget

- **Reading:** Deuteronomy 4:1–6:25
- **Included structure:** Story A, scenes 29–38; Story B, scenes 1–12
- **Daily movement:** Begins when historical review turns directly into exhortation: hear, obey, and neither add to nor diminish the command. Moses appeals to Horeb, warns against images, foretells exile, promises that the LORD may be found when sincerely sought, and declares that no other god has acted as Israel’s God has. It ends with the three eastern cities of refuge, closing the first address. Begins with the superscription to Moses’ second address. The Horeb covenant and Ten Commandments are restated, including the Sabbath grounded in deliverance from Egypt. The people request a mediator, and Moses turns to the covenant’s heart: hear, love, remember, teach, and tell the children what the LORD did. It ends with the child’s question answered through the exodus story.
- **Why it begins and ends here:** The covenant summons in Deuteronomy 4 leads directly into the Decalogue, the Shema, and the warning not to forget the LORD. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 3,067 words; 15.3 min reading; 19.8 min audio
- **Review:** Yellow boundary; Elevated load
- **v0.2 change:** Combines v0.1 Days 65 and 66.

### Day 63 — March 4 — Chosen in Love; Do Not Forget

- **Reading:** Deuteronomy 7:1–8:20
- **Included structure:** Story B, scenes 13–23
- **Daily movement:** Begins with Israel’s coming encounter with the nations and the call to reject their worship. Israel is chosen not for greatness but because of the LORD’s love and covenant faithfulness. Moses then recalls wilderness testing and warns that abundance may produce self-sufficiency. It ends with the warning that forgetting the LORD will make Israel perish like the nations before them.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,409 words; 7.0 min reading; 9.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 64 — March 5 — Not for Your Righteousness: Circumcise Your Heart

- **Reading:** Deuteronomy 9:1–11:32
- **Included structure:** Story B, scenes 24–44
- **Daily movement:** Begins with Israel preparing to cross Jordan and the repeated warning that the land is not given because of their righteousness. The golden calf and other rebellions expose their stubbornness, while Moses’ intercession demonstrates mercy. The appeal culminates in circumcising the heart, loving the foreigner, teaching the children, and choosing between blessing and curse. It ends with Gerizim and Ebal awaiting the covenant ceremony.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,517 words; 12.6 min reading; 16.2 min audio
- **Review:** Green boundary; Normal load

### Day 65 — March 6 — The Place the LORD Will Choose

- **Reading:** Deuteronomy 12:1–14:29
- **Included structure:** Story C, scenes 1–20
- **Daily movement:** Begins the Deuteronomic Code by commanding the destruction of pagan worship sites and establishing the place where the LORD will cause his name to dwell. Sacrifice, blood, false prophets, enticement to other gods, clean and unclean foods, and tithes all define Israel as a holy people. It ends with the third-year provision for Levite, foreigner, orphan, and widow.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,390 words; 11.9 min reading; 15.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 66 — March 7 — Open Your Hand; Pursue Justice; Hear the Prophet

- **Reading:** Deuteronomy 15:1–18:22
- **Included structure:** Story C, scenes 21–41
- **Daily movement:** Begins with the Sabbath-year release and the command to open the hand to the poor. Servants are released generously, firstborn animals are consecrated, and the three annual feasts gather Israel before the LORD. The movement then orders judges, kings, priests, Levites, and prophets. It ends with the test distinguishing a true prophet from one who speaks presumptuously.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,735 words; 13.7 min reading; 17.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 67 — March 8 — Refuge, Warfare, and the Guilt of Innocent Blood

- **Reading:** Deuteronomy 19:1–21:23
- **Included structure:** Story C, scenes 42–59
- **Daily movement:** Begins with cities of refuge protecting accidental killers while denying sanctuary to murderers. Boundaries, witnesses, warfare, siege, fruit trees, unsolved murder, captive women, inheritance, and family judgment are governed by justice and restraint. It ends with the executed body removed before nightfall because one hanged on a tree is under God’s curse.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,985 words; 9.9 min reading; 12.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 68 — March 9 — Your Brother’s Good; the Stranger’s Justice

- **Reading:** Deuteronomy 22:1–24:22
- **Included structure:** Story C, scenes 60–83
- **Daily movement:** Begins with responsibility for a neighbor’s lost animal and moves through household safety, sexual integrity, assembly membership, camp holiness, escaped slaves, interest, vows, divorce, pledges, wages, and personal liability. It ends with gleaning laws for the foreigner, orphan, and widow, grounded in Israel’s memory of slavery in Egypt.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,260 words; 11.3 min reading; 14.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 69 — March 10 — A Wandering Aramean; the LORD’s Treasured People

- **Reading:** Deuteronomy 25:1–26:19
- **Included structure:** Story C, scenes 84–94
- **Daily movement:** Begins with laws preserving dignity, family continuity, honest commerce, and the memory of Amalek. The code culminates when the worshiper brings firstfruits and recites Israel’s story: wandering, oppression, deliverance, and gift of the land. It ends with the mutual covenant declaration that Israel is the LORD’s treasured people and must walk in his ways.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,229 words; 6.1 min reading; 7.9 min audio
- **Review:** Green boundary; Normal load

### Day 70 — March 11 — Blessing and Curse Upon the Land

- **Reading:** Deuteronomy 27:1–28:68
- **Included structure:** Story D, scenes 1–21
- **Daily movement:** Begins with the commanded covenant ceremony in the land: the law written on plastered stones, an altar on Ebal, and public curses affirmed by the people. Blessings then overtake obedience, while the curses progressively reverse Israel’s health, harvest, security, freedom, family, land, and exodus itself. It ends with Israel scattered and returned to bondage in Egypt.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,674 words; 13.4 min reading; 17.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 71 — March 12 — Choose Life

- **Reading:** Deuteronomy 29:1–30:20
- **Included structure:** Story D, scenes 22–33
- **Daily movement:** Begins with covenant renewal in Moab beyond the covenant made at Horeb. The oath binds every rank and future generation, exposes secret idolatry, and explains the devastation that covenant abandonment will bring. Yet return remains possible: the LORD will gather, restore, and circumcise the heart. It ends with life and death set before Israel and the command to choose life by loving and clinging to the LORD.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,516 words; 7.6 min reading; 9.8 min audio
- **Review:** Green boundary; Normal load

### Day 72 — March 13 — The Song That Will Testify

- **Reading:** Deuteronomy 31:1–32:52
- **Included structure:** Story E, scenes 1–18
- **Daily movement:** Begins with Moses announcing his approaching death and charging Joshua to be strong and courageous. The law is deposited and assigned for public reading, while the Song of Moses is commissioned as a witness against future apostasy. The song recounts divine faithfulness, Israel’s corruption, judgment, and final vindication. It ends with Moses commanded to ascend Nebo and view the land he may not enter.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,347 words; 11.7 min reading; 15.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 73 — March 14 — There Is None Like Godand No Prophet Like Moses

- **Reading:** Deuteronomy 33:1–34:12
- **Included structure:** Story E, scenes 19–28
- **Daily movement:** Begins with Moses’ final blessing over Israel’s tribes and culminates in praise of the incomparable God of Jeshurun. Moses then views the whole land, dies according to the LORD’s word, and is buried in an unknown grave. Joshua succeeds him, but the final eulogy declares that no prophet has arisen like Moses, whom the LORD knew face to face. This is the book ending.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,125 words; 5.6 min reading; 7.3 min audio
- **Review:** Green boundary; Normal load

### Day 74 — March 15 — Be Strong and Courageous; Rahab Believes

- **Reading:** Joshua 1:1–2:24
- **Included structure:** Story A, scenes 1–11
- **Daily movement:** Begins after Moses’ death with Joshua commanded to cross Jordan, obey the book of the law, and lead Israel courageously. The eastern tribes reaffirm their allegiance, and the two spies enter Jericho, where Rahab confesses that the LORD has given Israel the land. It ends when the spies return with a faithful report directly reversing the unbelieving report of Numbers 13.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,341 words; 6.7 min reading; 8.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 75 — March 16 — Through the Jordan into the Presence of the Commander

- **Reading:** Joshua 3:1–5:15
- **Included structure:** Story A, scenes 12–25
- **Daily movement:** Begins with Israel preparing to cross the flooded Jordan. The waters stop, the nation crosses on dry ground, and twelve stones become a teaching memorial for future children. Circumcision renews the covenant sign, Passover is kept, and the manna ceases. It ends with Joshua before the commander of the LORD’s army, barefoot on holy ground and ready for Jericho.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,823 words; 9.1 min reading; 11.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 76 — March 17 — Jericho Falls; Hidden Sin Defeats Israel

- **Reading:** Joshua 6:1–7:26
- **Included structure:** Story A, scenes 26–36
- **Daily movement:** Begins with the LORD’s unconventional battle plan for Jericho. The city falls, Rahab’s household is rescued, and everything under the ban belongs to the LORD. Achan’s hidden violation then brings defeat at Ai and guilt upon the whole camp. It ends after his confession and judgment in the Valley of Achor, where the LORD turns from his fierce anger.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,831 words; 9.2 min reading; 11.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 77 — March 18 — Ai Restored; a Covenant Made Without Counsel

- **Reading:** Joshua 8:1–9:27
- **Included structure:** Story A, scenes 37–49
- **Daily movement:** Begins with “Fear not” and a renewed command to attack Ai. Victory restores Israel after Achan’s sin, and Joshua renews the covenant at Mount Ebal by reading every word of the law. The Gibeonites then obtain a treaty through deception because Israel does not ask counsel of the LORD. It ends with the oath honored and the Gibeonites assigned service at the sanctuary.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,021 words; 10.1 min reading; 13.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 78 — March 19 — The LORD Fought for Israel

- **Reading:** Joshua 10:1–12:24
- **Included structure:** Story A, scenes 50–67
- **Daily movement:** Begins when five Amorite kings attack Gibeon and Israel must defend the covenant it made. The LORD throws the enemy into confusion, sends hailstones, and answers Joshua as the sun stands still. The southern and northern coalitions fall, the Anakim are cut off, and the land rests from war. It ends with the complete register of thirty-one defeated kings, the military campaign’s formal colophon.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,596 words; 13.0 min reading; 16.7 min audio
- **Review:** Green boundary; Normal load

### Day 79 — March 20 — Give Me This Mountain

- **Reading:** Joshua 13:1–15:63
- **Included structure:** Story B, scenes 1–27
- **Daily movement:** Begins when the aged Joshua is commanded to divide the land that remains. The eastern inheritances are reviewed, and the division west of Jordan begins. Caleb asks for the hill country promised to him because he wholly followed the LORD; Hebron is given to him, and Judah’s borders and cities are recorded. It ends with the Jebusites remaining in Jerusalem, completing Judah’s allotment while acknowledging unfinished possession.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,342 words; 11.7 min reading; 15.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 80 — March 21 — The Land Divided at Shiloh

- **Reading:** Joshua 16:1–19:51
- **Included structure:** Story B, scenes 28–53
- **Daily movement:** Begins with the inheritance of Joseph through Ephraim and Manasseh, including the fulfilled claim of Zelophehad’s daughters. The remaining land is surveyed from the tabernacle at Shiloh, lots are cast for seven tribes, and Joshua receives his own inheritance last. It ends with the declaration that the division of the land is finished before the LORD at Shiloh.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,627 words; 13.1 min reading; 16.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 81 — March 22 — Not One Good Word Failed

- **Reading:** Joshua 20:1–21:45
- **Included structure:** Story B, scenes 54–68
- **Daily movement:** Begins with the appointment of the six cities of refuge, ensuring ordered justice within the inherited land. The Levites then receive forty-eight cities distributed among the tribes. It ends with the great theological conclusion: the LORD gave Israel the land and rest, and not one good word of everything he promised failed.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,334 words; 6.7 min reading; 8.6 min audio
- **Review:** Green boundary; Normal load

### Day 82 — March 23 — The Altar Called Witness; Choose Whom Ye Will Serve

- **Reading:** Joshua 22:1–24:33
- **Included structure:** Story C, scenes 1–7; Story C, scenes 8–18
- **Daily movement:** Begins when Joshua releases the eastern tribes after their faithful military service. Their great altar beside Jordan appears to threaten apostasy and nearly provokes civil war. A delegation confronts them, but the tribes explain that the altar is not for sacrifice—it is a witness that their descendants share in the LORD. It ends with peace restored and the altar named as testimony between east and west. Begins with Joshua’s farewell warning to hold fast to the LORD and avoid covenant compromise. At Shechem he retells the covenant history from Abraham through the conquest and calls Israel to choose whom it will serve. The covenant is renewed and a stone becomes its witness. It ends with the deaths and burials of Joshua and Eleazar and the burial of Joseph’s bones, formally closing the conquest generation.
- **Why it begins and ends here:** The eastern tribes’ altar crisis and Joshua’s farewell both concern covenant unity, exclusive allegiance, and faithful possession of the land. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Book
- **KJV load:** 2,939 words; 14.7 min reading; 19.0 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 86 and 87.

### Day 83 — March 24 — They Did Not Drive Them Out

- **Reading:** Judges 1:1–3:31
- **Included structure:** Stories A–C; Story A scenes 1–10, Story B scenes 1–5, Story C scenes 1–6
- **Daily movement:** Begins after Joshua’s death with Israel asking who should continue the conquest. Initial victories give way to the repeated failure to drive out the inhabitants, and the angel’s rebuke at Bochim explains the resulting snare. The theological cycle of apostasy, oppression, crying out, and deliverance is then established and demonstrated through Othniel, Ehud, and Shamgar. It ends after the first complete judge cycles establish the book’s governing pattern.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,496 words; 12.5 min reading; 16.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 84 — March 25 — Deborah Arose; the Stars Fought

- **Reading:** Judges 4:1–5:31
- **Included structure:** Story D, scenes 1–12
- **Daily movement:** Begins with renewed apostasy and Jabin’s oppression. Deborah summons Barak, Sisera’s army is routed, and Jael completes the deliverance with a tent peg. The prose account is then retold through Deborah and Barak’s song, which praises willing tribes, condemns those who remained behind, and portrays creation itself fighting for Israel. It ends with Sisera’s mother waiting in vain and the land resting forty years.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,516 words; 7.6 min reading; 9.8 min audio
- **Review:** Green boundary; Normal load

### Day 85 — March 26 — The LORD Is Peace; Three Hundred Go Down

- **Reading:** Judges 6:1–7:25
- **Included structure:** Story E, scenes 1–15
- **Daily movement:** Begins with Midian reducing Israel to caves and hunger. A prophet exposes Israel’s disobedience, and the angel calls fearful Gideon a mighty warrior. Gideon tears down Baal’s altar, receives signs, and musters an army that God reduces to three hundred. It ends after the trumpet-and-jar victory and the deaths of Oreb and Zeeb, completing the battlefield deliverance before Gideon’s troubling aftermath.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,247 words; 11.2 min reading; 14.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 86 — March 27 — Gideon’s Snare and Abimelech’s Ruin

- **Reading:** Judges 8:1–9:57
- **Included structure:** Story E, scenes 16–24; Story F, scenes 1–13
- **Daily movement:** Begins with the human aftermath of victory: tribal jealousy, refused hospitality, vengeance, and the execution of Midian’s kings. Gideon refuses hereditary kingship by declaring that the LORD will rule Israel, yet uses the spoil to make an ephod that becomes a snare. It ends with Gideon dead, Israel again serving Baal, and his household forgotten. The short reading preserves the story’s essential reversal from deliverer to compromised ruler. Begins when Abimelech purchases support, murders his brothers, and is crowned at Shechem. Jotham’s fable exposes him as the destructive bramble-king whose fire will consume both ruler and subjects. Treachery, revolt, massacre, and burning fulfill the warning until a woman’s millstone crushes Abimelech’s skull. It ends by explicitly declaring that God repaid Abimelech and Shechem and brought Jotham’s curse upon them.
- **Why it begins and ends here:** Abimelech’s violent counterfeit kingship is the direct bitter fruit of Gideon’s household, ephod, and compromised legacy. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,654 words; 13.3 min reading; 17.1 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 91 and 92.

### Day 87 — March 28 — Jephthah the Outcast and the Cost of His Vow

- **Reading:** Judges 10:1–12:7
- **Included structure:** Story G, scenes 1–15
- **Daily movement:** Begins with Tola and Jair after Abimelech, followed by Israel’s deepest catalog of idolatry and the LORD’s refusal of superficial appeal. When Israel puts away its gods, the elders recruit the outcast Jephthah. His historical argument to Ammon is rejected, and his Spirit-empowered victory is entangled with a rash vow concerning his daughter. It ends after civil conflict with Ephraim, the shibboleth test, and Jephthah’s death.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,975 words; 9.9 min reading; 12.7 min audio
- **Review:** Green boundary; Normal load

### Day 88 — March 29 — A Nazirite from the Womb; a Marriage among Philistines

- **Reading:** Judges 12:8–14:20
- **Included structure:** Story H, scenes 1–12
- **Daily movement:** Begins with the final minor judges before turning to the miraculous announcement of Samson’s birth. He is consecrated as a Nazirite before birth, yet his adult story immediately centers upon desire for a Philistine woman. The lion, honey, wedding feast, and riddle lead to betrayal and bloodshed. It ends with Samson’s wife given to his companion, completing the failed marriage and preparing the next cycle of vengeance.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,603 words; 8.0 min reading; 10.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 89 — March 30 — Samson’s Strength, Blindness, and Final Cry

- **Reading:** Judges 15:1–16:31
- **Included structure:** Story H, scenes 13–24
- **Daily movement:** Begins with Samson returning for his wife and escalating personal vengeance through fire, slaughter, and the jawbone victory. His strength continues at Gaza, but Delilah presses him until he reveals his consecration. Blinded and mocked in Dagon’s temple, Samson asks God for strength once more and dies with the Philistines. It ends with his burial and the summary that he judged Israel twenty years.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,758 words; 8.8 min reading; 11.3 min audio
- **Review:** Green boundary; Normal load

### Day 90 — March 31 — No King: Idols at Dan and Outrage at Gibeah

- **Reading:** Judges 17:1–19:30
- **Included structure:** Story I, scenes 1–9; Story J, scenes 1–6
- **Daily movement:** Begins with Micah manufacturing a private religion from stolen silver, household idols, and a hired Levite. The Danites steal the shrine and priest, destroy peaceful Laish, and establish enduring idolatry at Dan. A second Levite then enters Gibeah, where hospitality collapses into an outrage resembling Sodom. It ends with the woman’s body divided and sent throughout Israel, forcing the nation to behold what it has become.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,522 words; 12.6 min reading; 16.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 91 — April 1 — Israel Devours Itself

- **Reading:** Judges 20:1–21:25
- **Included structure:** Story J, scenes 7–23
- **Daily movement:** Begins when all Israel assembles to judge Gibeah. Benjamin protects the guilty, Israel suffers two defeats, and the third battle nearly annihilates the tribe. The people then mourn a destruction produced by their own oaths and manufacture increasingly corrupt solutions: massacring Jabesh-gilead and permitting the seizure of women at Shiloh. It ends with the book’s verdict that there was no king and everyone did what was right in his own eyes.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 2,195 words; 11.0 min reading; 14.2 min audio
- **Review:** Green boundary; Normal load

### Day 92 — April 2 — From Empty to Full: Ruth and the Redeemer

- **Reading:** Ruth 1:1–4:22
- **Included structure:** Stories A–D; Story A scenes 1–5, Story B scenes 1–5, Story C scenes 1–5, Story D scenes 1–4
- **Daily movement:** Begins “in the days when the judges ruled,” connecting the story directly to the preceding book. Famine, exile, and death leave Naomi empty, but Ruth clings to her and returns to Bethlehem. Providence leads Ruth to Boaz's field; steadfast kindness leads to the threshing-floor appeal; and lawful redemption at the gate produces marriage, a son, Naomi's restored fullness, and a genealogy ending with David. The whole book forms one tightly constructed movement and ends with its intimate family story joined to Israel's royal history.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 2,574 words; 12.9 min reading; 16.6 min audio
- **Review:** Green boundary; Normal load

### Day 93 — April 3 — For This Child I Prayed

- **Reading:** 1 Samuel 1:1–2:36
- **Included structure:** Story A, scenes 1–16
- **Daily movement:** Begins with Hannah’s barrenness, grief, and misunderstood prayer at Shiloh. Samuel is born in answer to prayer, dedicated to the LORD, and interpreted through Hannah’s song of divine reversal and the coming anointed king. Samuel’s faithful growth is contrasted with Eli’s corrupt sons, and a man of God announces judgment upon Eli’s house. It ends with the promise that the LORD will raise up a faithful priest.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,886 words; 9.4 min reading; 12.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 94 — April 4 — The Glory Departs—and the Ark Needs No Army

- **Reading:** 1 Samuel 3:1–7:17
- **Included structure:** Story A, scenes 17–27; Story A, scenes 28–39
- **Daily movement:** Begins when the word of the LORD is rare and the boy Samuel hears his name called at night. He receives the judgment against Eli’s house and is established throughout Israel as a prophet. Israel then treats the ark as a weapon, loses it to the Philistines, and sees Hophni, Phinehas, and Eli die. It ends with the birth and naming of Ichabod: the glory has departed from Israel. Begins with the captured ark placed before Dagon. Without an Israelite army, the LORD topples the idol, afflicts the Philistine cities, and directs the ark’s return. After judgment at Beth-shemesh, the ark rests at Kiriath-jearim. Samuel calls Israel to put away its gods, and the LORD defeats the Philistines at Mizpah. It ends with Samuel’s judgeship and altar at Ramah, completing his rise and Eli’s replacement.
- **Why it begins and ends here:** Samuel’s call, the ark’s capture, Dagon’s fall, the ark’s return, and Ebenezer complete the transfer from Eli’s failed house to Samuel’s judgeship. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,983 words; 14.9 min reading; 19.2 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 100 and 101.

### Day 95 — April 5 — Give Us a King

- **Reading:** 1 Samuel 8:1–10:27
- **Included structure:** Story B, scenes 1–20
- **Daily movement:** Begins when Samuel’s corrupt sons provoke Israel to demand a king like the nations. The LORD identifies the demand as rejection of his kingship, and Samuel warns that such a king will take their children, land, produce, and servants. Saul enters while searching for donkeys, is privately anointed, receives signs and a changed heart, and is publicly selected by lot. It ends with supporters and detractors revealed after the cry, “God save the king.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,394 words; 12.0 min reading; 15.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 96 — April 6 — Behold Your King; Fear the LORD

- **Reading:** 1 Samuel 11:1–12:25
- **Included structure:** Story B, scenes 21–28
- **Daily movement:** Begins when Nahash threatens Jabesh-gilead and the Spirit rushes upon Saul. His rescue confirms the monarchy at Gilgal, where the people rejoice before the LORD. Samuel then establishes his integrity, recounts the LORD’s deliverances, exposes the people’s demand for a king, and calls thunder and rain as a sign. It ends with the warning that both people and king will be swept away if they persist in wickedness.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,274 words; 6.4 min reading; 8.2 min audio
- **Review:** Green boundary; Normal load

### Day 97 — April 7 — Nothing Can Hinder the LORD

- **Reading:** 1 Samuel 13:1–14:52
- **Included structure:** Story C, scenes 1–18
- **Daily movement:** Begins with conflict against the Philistines and Saul’s impatient sacrifice at Gilgal, which costs his house the kingdom. While Saul hesitates, Jonathan trusts that nothing can hinder the LORD from saving by many or by few. God sends panic and victory, but Saul’s rash oath endangers Jonathan and causes the hungry people to sin. It ends with the people rescuing Jonathan and a summary of Saul’s wars and household.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,303 words; 11.5 min reading; 14.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 98 — April 8 — To Obey Is Better Than Sacrifice

- **Reading:** 1 Samuel 15:1–35
- **Included structure:** Story C, scenes 19–26
- **Daily movement:** Begins with the command concerning Amalek. Saul spares Agag and the best livestock, then claims to have obeyed. Samuel exposes his rebellion and declares that hearing the LORD is better than sacrifice. Saul’s robe tears as a sign that the kingdom has been torn away, Agag is executed, and Samuel departs. It ends with Samuel never seeing Saul again and the LORD grieving over Saul’s kingship.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 981 words; 4.9 min reading; 6.3 min audio
- **Review:** Green boundary; Light load

### Day 99 — April 9 — The LORD Looks on the Heart; David Faces Goliath

- **Reading:** 1 Samuel 16:1–17:58
- **Included structure:** Story D, scenes 1–19
- **Daily movement:** Begins when Samuel is sent to Bethlehem to anoint one of Jesse’s sons. The LORD rejects outward appearance, chooses David, and sends his Spirit upon him as the Spirit departs from Saul. David enters Saul’s service and then confronts Goliath without royal armor, coming in the name of the LORD. It ends after Goliath’s defeat, the Philistine rout, and Saul asking whose son the young victor is.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,399 words; 12.0 min reading; 15.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 100 — April 10 — Saul’s Spear and Jonathan’s Covenant

- **Reading:** 1 Samuel 18:1–20:42
- **Included structure:** Story D, scenes 20–43
- **Daily movement:** Begins with Jonathan’s soul bound to David and his covenant gift of robe and weapons. David’s success and the women’s song ignite Saul’s fear and jealousy. Spears, military plots, marriage schemes, assassins, and prophetic frenzy fail to destroy David. Jonathan finally confirms his father’s murderous purpose and renews covenant with David. It ends with their tearful farewell and David leaving the royal court as a fugitive.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,830 words; 14.2 min reading; 18.3 min audio
- **Review:** Green boundary; Normal load

### Day 101 — April 11 — David the Fugitive; Saul Slaughters the Priests

- **Reading:** 1 Samuel 21:1–23:29
- **Included structure:** Story E, scenes 1–14
- **Daily movement:** Begins with David alone at Nob, receiving holy bread and Goliath’s sword while Doeg watches. David feigns madness at Gath, gathers distressed followers at Adullam, and becomes an outlaw leader. Saul answers with paranoia and the massacre of Nob’s priests, while Abiathar escapes with the ephod. David saves Keilah, receives strength from Jonathan, and narrowly escapes Saul. It ends at the Rock of Escape when a Philistine invasion forces Saul away.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,091 words; 10.5 min reading; 13.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 102 — April 12 — The LORD Judge Between Me and Thee

- **Reading:** 1 Samuel 24:1–26:25
- **Included structure:** Story E, scenes 15–36
- **Daily movement:** Begins when Saul unknowingly enters David’s cave. David refuses to kill the LORD’s anointed, and Saul admits that David is more righteous. Samuel dies; Nabal’s insult then tempts David toward bloodshed, but Abigail’s wisdom restrains him and anticipates his sure house. David spares Saul again in the camp at night. It ends with Saul’s final blessing over David and their permanent separation.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,962 words; 14.8 min reading; 19.1 min audio
- **Review:** Green boundary; Normal load

### Day 103 — April 13 — David Recovers All; Saul Falls on Gilboa

- **Reading:** 1 Samuel 27:1–31:13
- **Included structure:** Story F, scenes 1–11; Story F, scenes 12–20
- **Daily movement:** Begins when David concludes that Saul will eventually kill him and defects to Achish. From Ziklag he conducts deceptive raids while appearing loyal to Philistia. The narrative then turns to Saul, abandoned by the guidance he rejected and seeking a medium at Endor. Samuel announces his death and Israel’s defeat. It ends when the Philistine commanders reject David and providentially dismiss him from the coming battle. Begins with David returning to find Ziklag burned and the families taken. He strengthens himself in the LORD, inquires through the ephod, defeats the Amalekites, recovers everything, and distributes the spoil with justice and generosity. The narrative then returns to Gilboa, where Saul’s sons die and Saul falls upon his sword. It ends with the men of Jabesh-gilead recovering and burying Saul’s body and fasting seven days.
- **Why it begins and ends here:** David’s Philistine exile, the rescue of Ziklag, and Saul’s death close the old reign and prepare David’s accession without interrupting a scene. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Book
- **KJV load:** 2,945 words; 14.7 min reading; 19.0 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 110 and 111.

### Day 104 — April 14 — How Are the Mighty Fallen; Two Houses Contend

- **Reading:** 2 Samuel 1:1–4:12
- **Included structure:** Story A, scenes 1–12; Story A, scenes 13–23
- **Daily movement:** Begins after Saul’s death when an Amalekite claims to have killed the LORD’s anointed. David executes him and laments Saul and Jonathan rather than celebrating the removal of his enemy. David is then anointed king of Judah while Abner establishes Ish-bosheth over Israel. The divided houses clash at Gibeon, Asahel is killed, and Abner calls for an end to the pursuit. It ends with Asahel buried and the opposing armies returned home. Begins with the house of Saul weakening while David’s house grows stronger. Abner breaks with Ish-bosheth and arranges to unite Israel under David, but Joab murders him. David publicly mourns and separates himself from the bloodguilt. Ish-bosheth is then murdered in bed, and David executes the killers who expected a reward. It ends with Ish-bosheth’s head buried in Abner’s tomb, closing the civil-war story.
- **Why it begins and ends here:** David’s lament and the ensuing conflict between Saul’s and David’s houses belong to the same transition from one kingdom to another. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 3,200 words; 16.0 min reading; 20.6 min audio
- **Review:** Green boundary; Elevated load
- **v0.2 change:** Combines v0.1 Days 112 and 113.

### Day 105 — April 15 — David’s Throne and the LORD’s House

- **Reading:** 2 Samuel 5:1–7:29
- **Included structure:** Story B, scenes 1–18
- **Daily movement:** Begins when all Israel anoints David king. Jerusalem becomes his capital, the Philistines are defeated, and the ark is brought toward Zion—first disastrously, then with reverence and rejoicing. David desires to build the LORD a house, but the LORD promises instead to build David a house and establish his throne forever. It ends with David’s prayer that God will bless the promised dynasty.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,195 words; 11.0 min reading; 14.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 106 — April 16 — Kindness at the King’s Table; Enemies Subdued

- **Reading:** 2 Samuel 8:1–10:19
- **Included structure:** Story B, scenes 19–29
- **Daily movement:** Begins with David’s victories over the surrounding nations and the dedication of captured wealth to the LORD. His administration brings justice, while Mephibosheth receives covenant kindness, restored land, and a permanent place at David’s table. Ammon’s insult then produces war, but Joab and Abishai defeat the combined armies. It ends with the Syrian kings making peace and serving Israel, completing the kingdom’s consolidation.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,463 words; 7.3 min reading; 9.4 min audio
- **Review:** Green boundary; Normal load

### Day 107 — April 17 — Thou Art the Man

- **Reading:** 2 Samuel 11:1–12:31
- **Included structure:** Story C, scenes 1–14
- **Daily movement:** Begins when kings go to battle but David remains in Jerusalem. Desire becomes adultery, deception, and Uriah’s calculated murder. Nathan’s parable turns David’s judgment upon himself, and the sword is pronounced over his house. The child dies, Solomon is born, and the Ammonite war finally concludes. It ends with David returning to Jerusalem, while the consequences of his sin are poised to unfold within his family.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,806 words; 9.0 min reading; 11.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 108 — April 18 — The Sword within David’s House

- **Reading:** 2 Samuel 13:1–14:33
- **Included structure:** Story C, scenes 15–33
- **Daily movement:** Begins with Amnon’s desire for Tamar, grotesquely mirroring David’s preceding sin. Tamar is violated and desolated; David is angry but inactive; Absalom waits and murders Amnon before fleeing. Joab engineers his return through the wise woman of Tekoa, but David refuses to see him until Absalom forces the issue. It ends with Absalom bowing before David and receiving a cold kiss—a false reconciliation that prepares rebellion.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,266 words; 11.3 min reading; 14.6 min audio
- **Review:** Green boundary; Normal load

### Day 109 — April 19 — David Flees Jerusalem

- **Reading:** 2 Samuel 15:1–16:23
- **Included structure:** Story D, scenes 1–12
- **Daily movement:** Begins with Absalom stealing Israel’s heart and proclaiming himself at Hebron. David abandons Jerusalem, but Ittai remains loyal, the ark is returned, and Hushai is sent back to frustrate Ahithophel. On the road, Ziba deceives David and Shimei curses him; inside Jerusalem, Absalom publicly claims his father’s household. It ends with Ahithophel’s counsel treated as though one had inquired at the word of God.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,856 words; 9.3 min reading; 12.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 110 — April 20 — O My Son Absalom

- **Reading:** 2 Samuel 17:1–18:33
- **Included structure:** Story D, scenes 13–27
- **Daily movement:** Begins with Ahithophel proposing immediate pursuit and Hushai arguing for delay. The LORD defeats Ahithophel’s counsel, David crosses Jordan, and Ahithophel dies by suicide. In the forest of Ephraim, Absalom hangs helplessly in the tree and Joab kills him against David’s command. It ends when the news reaches the king and David cries repeatedly for the son who tried to take his throne.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,031 words; 10.2 min reading; 13.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 111 — April 21 — The King Returns; Rebellion Rises Again

- **Reading:** 2 Samuel 19:1–20:26
- **Included structure:** Story D, scenes 28–45
- **Daily movement:** Begins with Joab forcing David to appear before the people instead of surrendering the victory to private grief. David negotiates his return, answers Shimei, hears Mephibosheth, honors Barzillai, and crosses Jordan amid growing tension between Judah and Israel. Sheba exploits that division, but a wise woman ends his revolt. It ends with David’s restored cabinet, formally closing the rebellion and return narrative.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,321 words; 11.6 min reading; 15.0 min audio
- **Review:** Green boundary; Normal load

### Day 112 — April 22 — The LORD Is My Rock

- **Reading:** 2 Samuel 21:1–22:51
- **Included structure:** Story E, scenes 1–16
- **Daily movement:** Begins the nonchronological appendix with a famine caused by Saul’s bloodguilt against the Gibeonites. Rizpah guards the dead until Saul and Jonathan receive honorable burial, and God is entreated for the land. Accounts of battles with giants then lead into David’s great song of deliverance. It ends with praise to the living Rock who gives victory and shows steadfast kindness to his anointed and his descendants forever.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,729 words; 8.6 min reading; 11.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 113 — April 23 — An Altar Where the Plague Was Stayed

- **Reading:** 2 Samuel 23:1–24:25
- **Included structure:** Story E, scenes 17–30
- **Daily movement:** Begins with David’s final oracle concerning righteous rule and God’s everlasting covenant. His mighty men are remembered, including Uriah at the list’s haunting conclusion. David then orders the census, confesses his sin, and chooses judgment from the LORD rather than men. The plague stops at Araunah’s threshing floor, where David refuses to offer what costs him nothing. It ends with sacrifice accepted and the land receiving relief.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,733 words; 8.7 min reading; 11.2 min audio
- **Review:** Green boundary; Normal load

### Day 114 — April 24 — The Kingdom Established in Solomon’s Hand

- **Reading:** 1 Kings 1:1–2:46
- **Included structure:** Story A, scenes 1–24
- **Daily movement:** Begins with David’s failing strength and Adonijah exploiting the approaching power vacuum. Nathan and Bathsheba secure David’s public declaration, and Solomon is anointed at Gihon while Jerusalem rejoices. David dies after charging Solomon to keep the LORD’s way, and the new king deals with Adonijah, Abiathar, Joab, and Shimei. It ends with the kingdom firmly established in Solomon’s hand.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 3,010 words; 15.1 min reading; 19.4 min audio
- **Review:** Green boundary; Elevated load

### Day 115 — April 25 — An Understanding Heart

- **Reading:** 1 Kings 3:1–4:34
- **Included structure:** Story B, scenes 1–13
- **Daily movement:** Begins with Solomon ruling independently and sacrificing at Gibeon. When God invites him to ask, Solomon requests a hearing heart capable of judging the people. The dispute between two mothers publicly demonstrates that gift, and the ordered administration, peace, abundance, learning, and international fame of Solomon’s wisdom follow. It ends with people from every nation coming to hear him.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,556 words; 7.8 min reading; 10.0 min audio
- **Review:** Green boundary; Normal load

### Day 116 — April 26 — The House and All Its Holy Furnishings

- **Reading:** 1 Kings 5:1–7:51
- **Included structure:** Story C, scenes 1–11; Story C, scenes 12–22
- **Daily movement:** Begins with Hiram contacting Solomon and the arrangements for cedar, stone, and labor. Construction starts in the fourth year of Solomon’s reign, and the house is built in reverent silence, lined with cedar, overlaid with gold, and centered upon the inner sanctuary and cherubim. It ends after seven years when the structure itself is completely built. Begins with Solomon’s palace complex before returning to the temple’s bronze and gold furnishings. Huram fashions the pillars, capitals, sea, wheeled stands, basins, and utensils, while Solomon supplies the altar, tables, lampstands, and sacred vessels. It ends when all the work for the house is finished and David’s dedicated treasures are placed within it.
- **Why it begins and ends here:** The temple’s structure and its furnishings are two phases of the same building movement and end with the completed house. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 3,027 words; 15.1 min reading; 19.5 min audio
- **Review:** Yellow boundary; Elevated load
- **v0.2 change:** Combines v0.1 Days 125 and 126.

### Day 117 — April 27 — The Glory Filled the House

- **Reading:** 1 Kings 8:1–66
- **Included structure:** Story C, scenes 23–40
- **Daily movement:** Begins with Israel assembled to bring the ark into the completed temple. The cloud fills the house, Solomon blesses the people, and his prayer asks God to hear from heaven when individuals, Israel, foreigners, armies, sinners, and exiles turn toward this place. Sacrifice and a great feast complete the dedication. It ends with the people returning home joyful over the LORD’s goodness.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,139 words; 10.7 min reading; 13.8 min audio
- **Review:** Green boundary; Normal load

### Day 118 — April 28 — The Half Was Not Told Me

- **Reading:** 1 Kings 9:1–10:29
- **Included structure:** Story D, scenes 1–13
- **Daily movement:** Begins with the LORD’s second appearance to Solomon, coupling the temple promise with a warning that apostasy will make the celebrated house a ruin. Solomon’s building, labor, trade, fleet, and wealth then display the kingdom’s glory. The Queen of Sheba tests his wisdom and declares that even the reports told her only half. It ends with Solomon accumulating chariots and horses, quietly introducing the excess that precedes his fall.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,665 words; 8.3 min reading; 10.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 119 — April 29 — Solomon’s Heart Turns; the Kingdom Divides

- **Reading:** 1 Kings 11:1–12:33
- **Included structure:** Story D, scenes 14–23; Story E, scenes 1–7
- **Daily movement:** Begins with Solomon loving many foreign women, who turn his heart toward other gods. The LORD announces that the kingdom will be torn, adversaries arise, and Ahijah’s torn cloak promises ten tribes to Jeroboam if he obeys. Solomon seeks Jeroboam’s life, repeating the pattern of Saul and David. It ends with Solomon’s death and Rehoboam’s succession, closing the united monarchy. Begins with Israel assembling at Shechem to make Rehoboam king and asking him to lighten Solomon’s yoke. He rejects the elders, threatens harsher oppression, and loses the northern tribes. Jeroboam then fears reunion through Jerusalem worship and establishes calves, unauthorized priests, and an invented feast. It ends with the political and religious division complete.
- **Why it begins and ends here:** Solomon’s apostasy produces the judgment announced against his house, and the next chapter shows that judgment taking political form in the schism. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,291 words; 11.5 min reading; 14.8 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 129 and 130.

### Day 120 — April 30 — The Word against the Altar

- **Reading:** 1 Kings 13:1–14:31
- **Included structure:** Story F, scenes 1–16
- **Daily movement:** Begins when a man of God confronts Jeroboam’s altar and announces Josiah by name. The altar splits, the king’s hand withers and is restored, but the prophet himself disobeys the word and dies by a lion. Ahijah then pronounces judgment upon Jeroboam’s house, while Rehoboam’s reign in Judah also descends into apostasy and invasion. It ends with Rehoboam’s death.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,125 words; 10.6 min reading; 13.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 121 — May 1 — The Sin of Jeroboam Deepens

- **Reading:** 1 Kings 15:1–16:34
- **Included structure:** Story F, scenes 17–35
- **Daily movement:** Begins with the interwoven reigns of Abijam and Asa in Judah. Asa does what is right but depends upon Aram against Baasha. In Israel, prophetic judgment and assassination destroy the houses of Jeroboam and Baasha; Zimri reigns seven days, Omri builds Samaria, and Ahab surpasses his predecessors in evil. It ends with Jericho rebuilt at the cost Joshua foretold, preparing Elijah’s arrival.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,986 words; 9.9 min reading; 12.8 min audio
- **Review:** Green boundary; Normal load

### Day 122 — May 2 — Fire on Carmel and the Voice at Horeb

- **Reading:** 1 Kings 17:1–19:21
- **Included structure:** Story G, scenes 1–15; Story G, scenes 16–20
- **Daily movement:** Begins with Elijah abruptly declaring drought to Ahab. Ravens feed him, a widow’s flour and oil endure, and her son is restored to life. Elijah then confronts Ahab and the prophets of Baal at Carmel. Baal gives no voice, answer, or attention; the LORD answers by fire, and the people confess him as God. It ends with rain returning and Elijah running before Ahab to Jezreel. Begins when Jezebel’s threat sends Elijah into the wilderness asking to die. Fed by an angel, he travels to Horeb, where wind, earthquake, and fire precede the quiet voice. The LORD answers Elijah’s despair with new commissions, coming judgment, and seven thousand who have not bowed to Baal. It ends with Elisha leaving everything to follow and serve Elijah.
- **Why it begins and ends here:** Carmel and Horeb belong together: Elijah’s public triumph is followed by collapse, flight, divine presence, recommissioning, and succession. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,809 words; 14.0 min reading; 18.1 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 133 and 134.

### Day 123 — May 3 — Victories, a Spared Enemy, and Naboth’s Vineyard

- **Reading:** 1 Kings 20:1–21:29
- **Included structure:** Stories H–I; Story H scenes 1–9, Story I scenes 1–6
- **Daily movement:** Begins with Ben-hadad’s arrogant demands and two prophetically promised victories for Israel. Ahab nevertheless spares the enemy appointed for destruction and receives a sentence through a prophetic sign-act. He then desires Naboth’s ancestral vineyard; Jezebel manufactures false testimony, has Naboth killed, and gives Ahab the land. Elijah pronounces doom, but judgment is deferred when Ahab humbles himself.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,388 words; 11.9 min reading; 15.4 min audio
- **Review:** Green boundary; Normal load

### Day 124 — May 4 — A Lying Spirit and a Random Arrow

- **Reading:** 1 Kings 22:1–53
- **Included structure:** Story J, scenes 1–12
- **Daily movement:** Begins when Ahab and Jehoshaphat plan to recover Ramoth-gilead. Four hundred prophets promise success, but Micaiah reveals Israel scattered like sheep and a lying spirit operating in Ahab’s prophetic court. Ahab disguises himself, yet an apparently random arrow finds the gap in his armor and dogs lick his blood. The regnal summaries of Jehoshaphat and Ahaziah follow. It ends with Ahab’s son continuing his father’s apostasy.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,517 words; 7.6 min reading; 9.8 min audio
- **Review:** Green boundary; Normal load

### Day 125 — May 5 — Elijah Taken Up; the Spirit Rests on Elisha

- **Reading:** 2 Kings 1:1–2:25
- **Included structure:** Story A, scenes 1–11
- **Daily movement:** Begins after Ahab’s death with Ahaziah seeking Baal-zebub instead of the LORD. Elijah announces his death, and fire answers the king’s first two captains. Elijah then crosses Jordan with Elisha, is taken in the whirlwind, and leaves his mantle and prophetic authority behind. It ends after Elisha heals Jericho’s water and judgment at Bethel publicly establishes him as Elijah’s successor.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,517 words; 7.6 min reading; 9.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 126 — May 6 — Is There No Prophet Here?

- **Reading:** 2 Kings 3:1–4:44
- **Included structure:** Story A, scenes 12–28
- **Daily movement:** Begins with Moab’s rebellion and three kings stranded without water. Elisha supplies divine guidance and victory, exposing the difference between royal helplessness and prophetic authority. The narrative then turns to households: a widow’s oil multiplies, the Shunammite receives a son and receives him back from death, poisoned food is healed, and twenty loaves feed a hundred. It ends when all eat and leave some according to the LORD’s word.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,217 words; 11.1 min reading; 14.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 127 — May 7 — Wash in Jordan Seven Times

- **Reading:** 2 Kings 5:1–27
- **Included structure:** Story A, scenes 29–35
- **Daily movement:** Begins with Naaman’s greatness, leprosy, and the testimony of an enslaved Israelite girl. The Syrian commander expects spectacle but is commanded simply to wash in Jordan. He humbles himself, is cleansed, and confesses that there is no God except in Israel. Elisha refuses payment, but Gehazi pursues wealth through deceit. It ends with Naaman’s disease transferred to Gehazi and his descendants.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 975 words; 4.9 min reading; 6.3 min audio
- **Review:** Yellow boundary; Light load

### Day 128 — May 8 — The Siege Broken; Elisha Weeps over Hazael

- **Reading:** 2 Kings 6:1–8:29
- **Included structure:** Story A, scenes 36–48; Story A, scenes 49–54
- **Daily movement:** Begins with the floating axe head before moving into war with Aram. Elisha reveals hidden plans, his servant’s eyes are opened to fiery horses, and a blinded army is fed and released. A later siege reduces Samaria to cannibalism, but Elisha promises sudden abundance. Four outcasts discover the abandoned enemy camp and announce good news. It ends with plenty exactly as foretold and the doubting officer trampled at the gate. Begins with the Shunammite returning after famine and providentially receiving her land. In Damascus, Elisha foretells Ben-hadad’s death and weeps over the violence Hazael will inflict upon Israel. Hazael murders the king and takes the throne. The evil reigns of Jehoram and Ahaziah in Judah then place both Ahaziah and wounded Joram together at Jezreel. It ends with every figure positioned for Jehu’s coup.
- **Why it begins and ends here:** The deliverance of Samaria gives way to the rise of Hazael, linking prophetic word, Aramean power, and the next stage of judgment. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,796 words; 14.0 min reading; 18.0 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 140 and 141.

### Day 129 — May 9 — Jehu Drives Furiously

- **Reading:** 2 Kings 9:1–10:36
- **Included structure:** Story B, scenes 1–19
- **Daily movement:** Begins when an emissary from Elisha secretly anoints Jehu and commissions him against Ahab’s house. Jehu kills Joram in Naboth’s field, Ahaziah dies, and Jezebel is thrown from the window. The purge expands through Ahab’s descendants, Judah’s royal relatives, and Baal’s worshipers. Yet Jehu retains Jeroboam’s calves. It ends with his qualified reward, Israel’s shrinking territory, and his death.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,408 words; 12.0 min reading; 15.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 130 — May 10 — A Son Hidden in the House of the LORD

- **Reading:** 2 Kings 11:1–12:21
- **Included structure:** Story B, scenes 20–29
- **Daily movement:** Begins when Athaliah attempts to destroy David’s royal line, but the infant Joash is hidden in the temple for six years. Jehoiada crowns him, Athaliah is executed, covenant is renewed, and Baal’s temple is destroyed. Joash later repairs the LORD’s house through a guarded offering chest and trusted workers. It ends after later apostasy, Syrian pressure, and Joash’s assassination.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,426 words; 7.1 min reading; 9.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 131 — May 11 — The Arrow of the LORD’s Deliverance

- **Reading:** 2 Kings 13:1–14:29
- **Included structure:** Story B, scenes 30–42
- **Daily movement:** Begins with Jehoahaz’s oppression and the LORD’s compassion upon Israel. The dying Elisha commands Jehoash to shoot the arrow of deliverance, rebukes his limited zeal, and dies; even his bones communicate life. The promised victories follow. Judah’s Amaziah rises and falls, while Jeroboam II restores Israel’s borders because the LORD sees its bitter affliction. It ends with Jeroboam’s death and Zechariah’s succession.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,656 words; 8.3 min reading; 10.7 min audio
- **Review:** Green boundary; Normal load

### Day 132 — May 12 — The Road to Exile: Why Israel Was Carried Away

- **Reading:** 2 Kings 15:1–17:41
- **Included structure:** Story C, scenes 1–14; Story C, scenes 15–22
- **Daily movement:** Begins with Azariah’s long reign in Judah while Israel enters rapid dynastic collapse. Zechariah’s murder ends Jehu’s promised four-generation line; Shallum, Menahem, Pekahiah, and Pekah follow amid assassination and Assyrian encroachment. In Judah, Ahaz practices idolatry, purchases Assyrian aid, copies a foreign altar, and displaces the LORD’s altar. It ends with the temple stripped for Assyria and Ahaz dead. Begins with Hoshea’s final reign and Samaria’s fall to Assyria. The narrative pauses to explain the catastrophe: Israel feared other gods, rejected the covenant, ignored the prophets, practiced divination, and followed worthless idols until they became worthless. Foreign nations then settle the land and mix worship of the LORD with their own gods. It ends with this syncretism continuing “unto this day.”
- **Why it begins and ends here:** The final decline of both kingdoms culminates in the narrator’s full theological explanation of Israel’s exile. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,993 words; 15.0 min reading; 19.3 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 145 and 146.

### Day 133 — May 13 — Hezekiah Spread the Letter before the LORD

- **Reading:** 2 Kings 18:1–19:37
- **Included structure:** Story D, scenes 1–18
- **Daily movement:** Begins with Hezekiah trusting the LORD, destroying the bronze serpent, and rebelling against Assyria. Sennacherib invades, and the Rabshakeh publicly attacks Hezekiah’s trust and the LORD’s ability to save. Hezekiah carries the threatening letter into the temple and prays. Isaiah answers Assyria’s arrogance, the angel strikes its army, and Sennacherib returns home. It ends with the Assyrian king murdered in his god’s temple.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,367 words; 11.8 min reading; 15.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 134 — May 14 — Set Thine House in Order; Manasseh Fills Jerusalem with Blood

- **Reading:** 2 Kings 20:1–21:26
- **Included structure:** Story D, scenes 19–30
- **Daily movement:** Begins with Hezekiah’s mortal illness, prayer, healing, and the sign of the returning shadow. His proud display to Babylonian envoys produces Isaiah’s first explicit announcement of Babylonian exile. Manasseh then reverses Hezekiah’s reforms, fills the temple with idols and Jerusalem with innocent blood, making judgment inevitable. It ends after Amon’s evil reign and assassination, with Josiah placed on the throne.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,407 words; 7.0 min reading; 9.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 135 — May 15 — The Book Found; the Covenant Renewed

- **Reading:** 2 Kings 22:1–23:30
- **Included structure:** Story D, scenes 31–45
- **Daily movement:** Begins with Josiah repairing the temple and the book of the law discovered within it. The king tears his clothes, Huldah confirms coming judgment, and Josiah publicly renews the covenant. He purges idols, priests, high places, Topheth, Bethel’s altar, and the shrines of Samaria, then keeps an unparalleled Passover. It ends with Judah’s sentence still standing and Josiah killed at Megiddo, extinguishing the final reforming hope.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,963 words; 9.8 min reading; 12.7 min audio
- **Review:** Green boundary; Normal load

### Day 136 — May 16 — The Temple Burned; a King Lifted from Prison

- **Reading:** 2 Kings 23:31–25:30
- **Included structure:** Story E, scenes 1–14
- **Daily movement:** Begins with the rapid succession of evil kings after Josiah. Egypt removes Jehoahaz; Babylon subdues Jehoiakim, deports Jehoiachin, and installs Zedekiah. Rebellion brings siege, famine, breached walls, blinded royalty, burned temple, demolished Jerusalem, execution, and exile. Yet the final scene lifts Jehoiachin from prison, seats him above other captive kings, and grants him continual provision. It ends with judgment complete but David’s line still alive.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,792 words; 9.0 min reading; 11.6 min audio
- **Review:** Green boundary; Normal load

### Day 137 — May 17 — From Adam to Israeland the House of Judah

- **Reading:** 1 Chronicles 1:1–2:55
- **Included structure:** Story A, scenes 1–26
- **Daily movement:** Begins with Adam and moves through Noah, the nations, Abraham, Esau, and the sons of Israel. The universal family narrows deliberately to Judah, Perez, Jesse, and David, then expands through the Judahite clans connected with Caleb, Jerahmeel, Bethlehem, Kiriath-jearim, and the scribes. It ends after Judah’s foundational family register has established the royal tribe at the center of Israel’s identity.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,529 words; 7.6 min reading; 9.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 138 — May 18 — The Line of David and the Tribes East of Jordan

- **Reading:** 1 Chronicles 3:1–5:26
- **Included structure:** Story A, scenes 27–48
- **Daily movement:** Begins with David’s sons, the kings from Solomon to the exile, and the continuation of David’s line through Jehoiachin and Zerubbabel. Further Judahite and Simeonite families follow, including Jabez’s prayer. The register then turns east to Reuben, Gad, and half-Manasseh: warriors who receive victory when they cry to God but are later exiled for unfaithfulness.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,863 words; 9.3 min reading; 12.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 139 — May 19 — The Priests, Singers, and Cities of Levi

- **Reading:** 1 Chronicles 6:1–81
- **Included structure:** Story A, scenes 49–68
- **Daily movement:** Begins with Levi’s sons and traces the high-priestly line through Aaron and Eleazar to the exile. Gershon, Kohath, and Merari are organized; Samuel’s ancestry appears; and David’s appointed singers—Heman, Asaph, and Ethan—stand within the Levitical line. Priestly and Levitical duties and cities then fill the land. It ends with the complete distribution of the Merarite cities.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,341 words; 6.7 min reading; 8.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 140 — May 20 — The Returned Exiles and the House of Saul

- **Reading:** 1 Chronicles 7:1–9:44
- **Included structure:** Story A, scenes 69–96
- **Daily movement:** Begins with the remaining tribal genealogies, including the ancestry of Joshua and the warriors of Issachar, Benjamin, and Asher. Benjamin’s register narrows to Saul and Jonathan. The narrative then reaches its intended audience: those who returned from exile and resettled Jerusalem—Judahites, priests, Levites, gatekeepers, singers, and sanctuary servants. It ends by repeating Saul’s genealogy, positioning his house for the death narrative that follows.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,282 words; 11.4 min reading; 14.7 min audio
- **Review:** Green boundary; Normal load

### Day 141 — May 21 — Saul Dies; All Israel Comes to David

- **Reading:** 1 Chronicles 10:1–12:40
- **Included structure:** Story B, scenes 1–25
- **Daily movement:** Begins with Saul’s defeat and death on Gilboa. The Chronicler interprets his fall as judgment for unfaithfulness and failure to inquire of the LORD, who transfers the kingdom to David. All Israel anoints David, Jerusalem is captured, and mighty warriors from every tribe gather to him. It ends with three days of national feasting and joy as Israel becomes united around its chosen king.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,295 words; 11.5 min reading; 14.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 142 — May 22 — Seek Him after the Due Order

- **Reading:** 1 Chronicles 13:1–16:43
- **Included structure:** Story B, scenes 26–53
- **Daily movement:** Begins with David’s first attempt to bring the ark, when Uzza dies because the holy object is transported improperly. After victories establish David’s rule, he prepares a second procession according to the law: Levites carry the ark, singers and musicians lead, sacrifices are offered, and the people rejoice. It ends with the ark installed, continual worship appointed, thanksgiving sung, and the people returning home blessed.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,307 words; 11.5 min reading; 14.9 min audio
- **Review:** Green boundary; Normal load

### Day 143 — May 23 — The LORD Will Build Thee a House

- **Reading:** 1 Chronicles 17:1–20:8
- **Included structure:** Story C, scenes 1–15
- **Daily movement:** Begins with David desiring to build a house for the ark. God answers by promising to build David a house, establish his descendant, and secure his throne forever. David responds in wonder and prayer. The covenant’s political results follow through victories, dedicated spoil, ordered administration, and the defeat of Ammon, Aram, and Philistine giants. It ends with the final giant slain by David’s servants.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,097 words; 10.5 min reading; 13.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 144 — May 24 — The Altar, the Temple Site, and the House Prepared

- **Reading:** 1 Chronicles 21:1–24:31
- **Included structure:** Story C, scenes 16–23; Story D, scenes 1–17
- **Daily movement:** Begins when an adversary incites David to count Israel. David recognizes his sin, chooses to fall into the LORD’s merciful hand, and sees plague strike the nation. At Ornan’s threshing floor, David purchases the site at full price, builds an altar, and receives fire from heaven. The angel sheathes the sword, and David identifies the place as the future house of God and altar for Israel. Begins immediately after the temple site is identified. David gathers materials, charges Solomon to build, and commands Israel’s leaders to help. He then reorganizes the Levites for service in the permanent sanctuary and arranges Aaron’s descendants into twenty-four priestly courses by lot. It ends with the remaining Levitical families receiving their assignments on equal terms.
- **Why it begins and ends here:** The plague-staying altar identifies the future temple site, after which David immediately prepares the house and its ministers. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,741 words; 13.7 min reading; 17.7 min audio
- **Review:** Yellow boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 158 and 159.

### Day 145 — May 25 — Singers, Gatekeepers, Treasurers, and Officers

- **Reading:** 1 Chronicles 25:1–27:34
- **Included structure:** Story D, scenes 18–40
- **Daily movement:** Begins with the musicians of Asaph, Heman, and Jeduthun appointed to prophesy with instruments. Lots order the singers and gatekeepers; trusted Levites guard the gates, vessels, treasuries, and dedicated gifts. Military divisions, tribal officers, agricultural stewards, and royal counselors complete the kingdom’s organization. It ends with David’s closest counselors and commanders named.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,058 words; 10.3 min reading; 13.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 146 — May 26 — Thine, O LORD, Is the Greatness

- **Reading:** 1 Chronicles 28:1–29:30
- **Included structure:** Story D, scenes 41–53
- **Daily movement:** Begins when David assembles Israel’s leaders and publicly identifies Solomon as God’s chosen temple builder. He gives Solomon the divinely received pattern and commands him to know God and serve with a whole heart. David and the leaders give willingly, the people rejoice, and David praises the LORD as the source and owner of everything. Solomon is enthroned, and David dies in honor after a full reign.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,852 words; 9.3 min reading; 11.9 min audio
- **Review:** Green boundary; Normal load

### Day 147 — May 27 — Wisdom for the House on Mount Moriah

- **Reading:** 2 Chronicles 1:1–4:22
- **Included structure:** Story A, scenes 1–17
- **Daily movement:** Begins with Solomon established in his kingdom and seeking God at Gibeon. He requests wisdom rather than wealth, and God grants both. Solomon then arranges labor and materials with Hiram, begins the temple on Mount Moriah, and constructs its holy spaces, cherubim, pillars, altar, sea, lavers, lampstands, tables, and vessels. It ends with the complete inventory of the temple’s principal furnishings.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,251 words; 11.3 min reading; 14.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 148 — May 28 — Fire from Heaven; If My People Shall Humble Themselves

- **Reading:** 2 Chronicles 5:1–7:22
- **Included structure:** Story A, scenes 18–35
- **Daily movement:** Begins when David’s dedicated treasures and the ark enter the completed temple. As priests and singers praise in unity, glory fills the house. Solomon prays for Israel, foreigners, sinners, sufferers, warriors, and future exiles; fire then falls from heaven and consumes the sacrifices. It ends with God’s answer promising healing to a humbled, praying people while warning that apostasy will make the temple an object of astonishment.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,647 words; 13.2 min reading; 17.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 149 — May 29 — Solomon’s Glory and the Kingdom Torn Apart

- **Reading:** 2 Chronicles 8:1–12:16
- **Included structure:** Story A, scenes 36–46; Story B, scenes 1–13
- **Daily movement:** Begins with Solomon’s cities, labor, worship arrangements, and fleet flowing from the completed temple. The Queen of Sheba arrives with hard questions, sees his wisdom and ordered kingdom, and declares that the report did not tell half the truth. Solomon’s wealth, throne, trade, horses, and international fame follow. It ends with his death and Rehoboam’s succession, closing Solomon’s reign. Begins when Rehoboam goes to Shechem and rejects the plea to lighten Solomon’s yoke. Israel abandons David’s house, but Shemaiah prevents civil war. Faithful priests and Levites strengthen Judah until Rehoboam forsakes the law. Shishak invades, and the king and princes humble themselves under prophetic rebuke. It ends with partial deliverance, bronze replacing gold, and Rehoboam’s death.
- **Why it begins and ends here:** Solomon’s completed glory is followed immediately by the folly that tears his kingdom; the contrast becomes clearer in one sitting. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,945 words; 14.7 min reading; 19.0 min audio
- **Review:** Yellow boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 164 and 165.

### Day 150 — May 30 — The LORD Is with You While Ye Be with Him

- **Reading:** 2 Chronicles 13:1–16:14
- **Included structure:** Story B, scenes 14–30
- **Daily movement:** Begins with Abijah confronting Jeroboam over the Davidic covenant, legitimate priesthood, and golden calves. Surrounded in battle, Judah cries to the LORD and receives victory. Asa then removes idols, seeks God, defeats a vast Cushite army, and renews covenant. Yet his final years reverse the pattern: he trusts Aram, rejects a seer, oppresses others, and seeks physicians instead of the LORD. It ends with Asa’s death.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,087 words; 10.4 min reading; 13.5 min audio
- **Review:** Green boundary; Normal load

### Day 151 — May 31 — Jehoshaphat’s Alliance, Reform, and Deliverance

- **Reading:** 2 Chronicles 17:1–20:37
- **Included structure:** Story C, scenes 1–12; Story C, scenes 13–23
- **Daily movement:** Begins with Jehoshaphat strengthening Judah, removing high places, and sending officials, Levites, and priests to teach the book of the law. His wealth and army grow, but he joins himself by marriage to Ahab. Four hundred prophets promise victory at Ramoth-gilead while Micaiah reveals the lying spirit and foretells defeat. It ends with Ahab struck by an apparently random arrow and dead at sunset. Begins when Jehu rebukes Jehoshaphat for helping the wicked. The king responds through renewed reform, judges, and a Jerusalem court charged to act for the LORD. A vast coalition then invades. Jehoshaphat confesses that Judah has no power and does not know what to do, but its eyes are upon God. Singers go before the army, the enemy destroys itself, and Judah returns with joy. It ends with Jehoshaphat’s final unwise alliance failing.
- **Why it begins and ends here:** Jehoshaphat’s disastrous alliance is answered by reform, prayer, and deliverance, preserving the complete moral movement. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 3,009 words; 15.0 min reading; 19.4 min audio
- **Review:** Green boundary; Elevated load
- **v0.2 change:** Combines v0.1 Days 167 and 168.

### Day 152 — June 1 — A Lamp Preserved through Blood and Usurpation

- **Reading:** 2 Chronicles 21:1–23:21
- **Included structure:** Story D, scenes 1–13
- **Daily movement:** Begins with Jehoram murdering his brothers and imitating Ahab’s house, though the LORD preserves a lamp for David. Elijah’s letter announces judgment, and Jehoram dies without regret. Ahaziah follows Athaliah’s counsel and dies in Jehu’s purge; Athaliah then attempts to destroy the royal line. Joash is hidden in the temple, crowned through Jehoiada’s covenant, and Athaliah is executed. It ends with Baal’s temple destroyed and the city quiet.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,855 words; 9.3 min reading; 12.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 153 — June 2 — Joash, Amaziah, and the Peril of Divided Hearts

- **Reading:** 2 Chronicles 24:1–25:28
- **Included structure:** Story D, scenes 14–27
- **Daily movement:** Begins with Joash repairing the temple under Jehoiada’s guidance. After Jehoiada dies, Joash turns to idols and has the prophet Zechariah stoned, bringing invasion and assassination. Amaziah begins by obeying the law and trusting God rather than hired troops, but after victory he worships Edom’s gods, rejects rebuke, provokes Israel, and is defeated and murdered. It ends with his body returned to Jerusalem for burial.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,903 words; 9.5 min reading; 12.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 154 — June 3 — Strength, Pride, Captivity, and a Closed Temple

- **Reading:** 2 Chronicles 26:1–28:27
- **Included structure:** Story D, scenes 28–41
- **Daily movement:** Begins with Uzziah seeking God and becoming strong through victory, building, agriculture, and military innovation. Strength produces pride, and he enters the temple unlawfully before being struck with leprosy. Jotham grows mighty by ordering his ways before the LORD, but Ahaz embraces idolatry, child sacrifice, foreign reliance, and the gods of Damascus. It ends with Ahaz shutting the temple and dying without burial among Judah’s kings.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,861 words; 9.3 min reading; 12.0 min audio
- **Review:** Green boundary; Normal load

### Day 155 — June 4 — The LORD Healed the People

- **Reading:** 2 Chronicles 29:1–30:27
- **Included structure:** Story E, scenes 1–15
- **Daily movement:** Begins when Hezekiah opens the temple doors and calls the Levites to cleanse the abandoned sanctuary. Sacrifice, music, worship, and willing offerings restore temple service. Hezekiah then invites all Israel and Judah to return for Passover. Some mock, others humble themselves, and God hears Hezekiah’s prayer for participants not ceremonially prepared. It ends after fourteen days of unprecedented joy, with the priestly blessing heard in heaven.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,026 words; 10.1 min reading; 13.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 156 — June 5 — With Us Is the LORD Our God

- **Reading:** 2 Chronicles 31:1–32:33
- **Included structure:** Story E, scenes 16–30
- **Daily movement:** Begins with the destruction of idols after Passover and Hezekiah’s reorganization of priests, Levites, tithes, and storerooms. His wholehearted work prospers. Sennacherib then invades and mocks trust in the LORD, but Hezekiah and Isaiah pray and receive miraculous deliverance. Hezekiah later becomes proud, humbles himself, and is tested by Babylonian envoys. It ends with his honored death.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,841 words; 9.2 min reading; 11.9 min audio
- **Review:** Green boundary; Normal load

### Day 157 — June 6 — When He Was in Affliction, He Besought the LORD

- **Reading:** 2 Chronicles 33:1–25
- **Included structure:** Story F, scenes 1–6
- **Daily movement:** Begins with Manasseh rebuilding idolatry, defiling the temple, practicing sorcery and child sacrifice, and leading Judah beyond the nations’ evil. Captured and bound by Assyria, he humbles himself, prays, and is restored to Jerusalem, where he removes idols and repairs the altar. Amon repeats the sin without the repentance. It ends with Amon assassinated and Josiah placed upon the throne.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 780 words; 3.9 min reading; 5.0 min audio
- **Review:** Green boundary; Light load

### Day 158 — June 7 — The Book Found, the Passover Kept, and the Land Desolate

- **Reading:** 2 Chronicles 34:1–36:23
- **Included structure:** Story G, scenes 1–14; Story H, scenes 1–6
- **Daily movement:** Begins with Josiah seeking God while young and purging idols throughout Judah and former Israel. During temple repair, the book of the law is found. Josiah tears his clothes, hears Huldah’s word, renews covenant, and leads a Passover unmatched since Samuel’s days. Yet he later refuses warning, enters Neco’s battle, and is killed. It ends with Jeremiah’s lament and Judah’s enduring mourning. Begins with the rapid fall of Judah’s final kings under Egypt and Babylon. Zedekiah and the leaders harden themselves, mock the messengers, and defile the temple until no remedy remains. Jerusalem and the house of God burn, the survivors enter exile, and the land keeps its neglected Sabbaths. It ends when Cyrus declares that the LORD has charged him to rebuild the temple and summons God’s people to go up.
- **Why it begins and ends here:** Josiah’s reform and Passover are followed by the irreversible collapse, exile, sabbath-rest of the land, and Cyrus’s decree. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Book
- **KJV load:** 2,864 words; 14.3 min reading; 18.5 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 175 and 176.

### Day 159 — June 8 — Whosoever Is among You, Let Him Go Up

- **Reading:** Ezra 1:1–2:70
- **Included structure:** Story A: The First Return and Temple Rebuilding; Scenes A1–A20
- **Daily movement:** The decree repeated from the conclusion of Chronicles becomes a human response: the LORD stirs Cyrus, awakens the exiles, and restores the temple vessels. The long register establishes that the returning community is not an anonymous migration but a people possessing historical and covenantal continuity. The reading ends after their gifts are recorded and the returnees settle in their ancestral towns. This completes the return-and-resettlement movement before the people assemble for worship.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,369 words; 6.8 min reading; 8.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 160 — June 9 — The Work Stopped; the Prophets Spoke; the House Was Finished

- **Reading:** Ezra 3:1–6:22
- **Included structure:** Story A; Scenes A21–A32; Story A; Scenes A33–A43
- **Daily movement:** The returned community gathers as one, rebuilds the altar, restores sacrifice and the Feast of Booths, and lays the temple foundation amid mingled shouting and weeping. Opposition then grows from rejected participation to political accusation and enforced cessation. The day ends at the story's deliberate low point: the work on the house of God has stopped. Haggai and Zechariah call the people back to the work. Tattenai's investigation leads to the rediscovery of Cyrus's decree, and Darius orders that the rebuilding be supported rather than obstructed. The temple is completed and dedicated, and the restored community celebrates Passover with joy. This closes the entire first-return story with worship restored in the completed house.
- **Why it begins and ends here:** The stopped foundation and the completed temple are an intentional problem-and-resolution pair joined by the prophetic word. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,677 words; 13.4 min reading; 17.3 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 178 and 179.

### Day 161 — June 10 — The Good Hand of His God Was upon Him

- **Reading:** Ezra 7:1–8:36
- **Included structure:** Story B: The Second Return and Community Reformation; Scenes B1–B16
- **Daily movement:** After the book's long chronological gap, Ezra is introduced through his priestly ancestry, prepared heart, and royal commission. He gathers the second company, secures Levites, proclaims a fast, entrusts the sacred treasure, and leads the people safely to Jerusalem. The reading ends after the treasure has been delivered and the royal decrees have been presented. Ezra's commission and journey have reached their natural completion before the community crisis is revealed.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,853 words; 9.3 min reading; 12.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 162 — June 11 — We Have Trespassed: Confession and a Costly Separation

- **Reading:** Ezra 9:1–10:44
- **Included structure:** Story B; Scenes B17–B33
- **Daily movement:** Ezra learns that members of the restored community have entered marriages bound up with covenant compromise. He tears his garments, mourns, and confesses Israel's accumulated guilt before God. The people respond with confession, covenant commitment, public assembly, investigation, and the difficult separation recorded in the closing register. The book ends soberly rather than triumphantly, but the crisis, confession, and communal response form one indivisible final movement.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,541 words; 7.7 min reading; 9.9 min audio
- **Review:** Green boundary; Normal load

### Day 163 — June 12 — Come, Let Us Build: The People Had a Mind to Work

- **Reading:** Nehemiah 1:1–4:23
- **Included structure:** Story A: Rebuilding the Wall Scenes A1–A8; Story A Scenes A9–A20
- **Daily movement:** Nehemiah receives the report of Jerusalem’s ruin, mourns, confesses Israel’s sin, and asks God for favor. The king grants his request; Nehemiah travels to Jerusalem, secretly inspects the ruins, and calls the leaders to rebuild. The day ends after the people resolve to work and Nehemiah answers the first mockery with confidence in the God of heaven. This completes the movement from burden and prayer to commission and public action. Priests, rulers, craftsmen, families, and servants rebuild the wall section by section until the circuit returns to its starting point. Mockery then becomes conspiracy, requiring the builders to combine prayer, vigilance, labor, and armed defense. The reading ends with the community living in continual readiness—working by day and guarding by night. Chapter 3’s communal labor and chapter 4’s defended labor constitute one sustained building movement.
- **Why it begins and ends here:** Nehemiah’s burden, commission, inspection, building, and first opposition form one continuous launch of the wall project. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,720 words; 13.6 min reading; 17.5 min audio
- **Review:** Yellow boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 182 and 183.

### Day 164 — June 13 — The Wall Finished and the People Reckoned

- **Reading:** Nehemiah 5:1–7:73
- **Included structure:** Story A Scenes A21–A28; Story A Scenes A29–A46
- **Daily movement:** Opposition now comes from within as impoverished Jews cry out against exploitation by their own brethren. Nehemiah rebukes the nobles, secures economic restitution, and demonstrates the integrity expected of a governor. External enemies then attempt distraction, slander, intimidation, and false prophecy. Nehemiah refuses every trap, and the wall is completed in fifty-two days. The lingering influence of Tobiah prevents this from being the full story ending, but the construction plot reaches its unmistakable climax. With the wall complete, Nehemiah appoints gatekeepers and trustworthy officials but confronts a new problem: the restored city remains largely empty. God moves him to gather the people genealogically, and the register of the first return establishes the community that can inhabit and sustain Jerusalem. The day ends with gifts made, the people settled in their towns, and the seventh month arriving. This closes the physical-restoration story and deliberately prepares the great assembly of chapter 8.
- **Why it begins and ends here:** Internal injustice and external opposition are overcome, the wall is completed, and the census secures the restored community. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,414 words; 12.1 min reading; 15.6 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 184 and 185.

### Day 165 — June 14 — The Book Read and a Sure Covenant Made

- **Reading:** Nehemiah 8:1–10:39
- **Included structure:** Story B: Renewing the Covenant Scenes B1–B4; Story B Scenes B5–B23
- **Daily movement:** The people gather as one and ask Ezra to bring the Book of the Law. Ezra reads, the Levites explain, and the people move from weeping under conviction to rejoicing because they understand. Further study leads to renewed observance of the Feast of Booths. The day ends when the feast and solemn assembly have been completed according to the Law. The reading is short, but adding the confession of chapter 9 would cross a clear change in date, posture, and purpose. The people gather in fasting and confession. Their prayer retells Scripture’s history from creation and Abraham through the Exodus, wilderness, conquest, rebellion, judgment, and repeated divine mercy. Confession becomes written commitment: leaders seal the covenant, and the community pledges concrete obedience concerning marriage, Sabbath, offerings, firstfruits, and tithes. The reading ends with the climactic resolve, “We will not forsake the house of our God.”
- **Why it begins and ends here:** The public reading of Torah leads directly to confession and the sealed covenant response. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,666 words; 13.3 min reading; 17.2 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 186 and 187.

### Day 166 — June 15 — Jerusalem Rejoices—and Nehemiah Remembers

- **Reading:** Nehemiah 11:1–13:31
- **Included structure:** Story C: Repopulating and Dedicating the City Scenes C1–C19; Story D: Nehemiah’s Final Reforms Scenes D1–D7
- **Daily movement:** Lots and voluntary sacrifice bring inhabitants into Jerusalem, while the accompanying registers establish the people, priests, Levites, officials, and surrounding settlements that sustain the restored city. The lists lead toward the dedication of the wall, where two thanksgiving companies encircle Jerusalem and meet in exuberant worship. The story ends with continuing provision for the temple ministries: the rebuilt city is now inhabited, dedicated, and functioning. After an absence from Jerusalem, Nehemiah returns to discover that earlier commitments have eroded. He expels Tobiah’s possessions from the temple chamber, restores support for the Levites, confronts Sabbath commerce, and addresses marriages threatening covenant continuity. Each cycle moves through discovery, contention, corrective action, and prayer. The memoir closes not with confidence in permanent human reform but with Nehemiah’s final appeal: “Remember me, O my God, for good.”
- **Why it begins and ends here:** Resettlement and dedication culminate in joy; the final reforms then close Nehemiah’s memoir with its repeated prayer for remembrance. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Book
- **KJV load:** 2,680 words; 13.4 min reading; 17.3 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 188 and 189.

### Day 167 — June 16 — Esther Obtained Grace and Favour

- **Reading:** Esther 1:1–2:23
- **Included structure:** Story A: The Great Reversal—Part 1: The Threat; Scenes A1–A11
- **Daily movement:** Ahasuerus displays his imperial wealth through extravagant feasts, but Vashti's refusal produces a royal crisis and an irreversible decree removing her from queenship. The resulting search brings Esther into the palace, where she conceals her Jewish identity, obtains favor, and is crowned queen. The day ends after Mordecai exposes a plot against the king and his unrewarded service is written in the royal chronicles. This completes Esther's rise and plants the apparently dormant event that will later reverse the entire story.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,522 words; 7.6 min reading; 9.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 168 — June 17 — For Such a Time as This

- **Reading:** Esther 3:1–5:14
- **Included structure:** Story A; Scenes A12–A21
- **Daily movement:** Haman is promoted, Mordecai refuses to bow, and Haman's wounded pride expands into a decree to annihilate every Jew in the empire. Mordecai's mourning brings the crisis to Esther, who must choose between concealed safety and dangerous identification with her people. After calling for a three-day fast, she approaches the king, receives the golden sceptre, and begins her carefully timed appeal. The day ends at maximum tension: Haman orders gallows built for Mordecai, unaware that he is preparing the instrument of his own downfall.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,563 words; 7.8 min reading; 10.1 min audio
- **Review:** Green boundary; Normal load

### Day 169 — June 18 — The Reversal Completed and Purim Established

- **Reading:** Esther 6:1–10:3
- **Included structure:** Story B: The Great Reversal—Part 2: The Deliverance; Scenes B1–B10; Story B; Scenes B11–B18
- **Daily movement:** The story turns on an ordinary sleepless night. Mordecai's forgotten service is read from the chronicles just as Haman arrives to request his execution. Haman must publicly honor the man he intended to kill; Esther then exposes him at the second banquet, and Haman dies on his own gallows. His property and authority pass to Esther and Mordecai, and a counter-edict gives the Jews the right to defend themselves. The reading ends with light, gladness, joy, and honor replacing the bewilderment produced by Haman's original decree. On the appointed day, the intended victims prevail over those seeking their destruction. The Jews defend themselves, refuse the spoil, and enter into rest, feasting, and gladness. Mordecai and Esther establish Purim so that the reversal will be remembered in every generation. The brief epilogue completes the ascent planted throughout the book: Mordecai now stands next to Ahasuerus, seeking the welfare and peace of his people. The powerless have been preserved and exalted without the narrator ever naming the divine hand governing the reversal.
- **Why it begins and ends here:** The hidden reversal, public victory, rest, Purim, and Mordecai’s exaltation are the complete resolution of Esther’s second half. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Book
- **KJV load:** 2,548 words; 12.7 min reading; 16.4 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 192 and 193.

### Day 170 — June 19 — Blessed Be the Name: Job Opens His Mouth

- **Reading:** Job 1:1–7:21
- **Included structure:** Story A: The Prologue—The Wager Scenes A1–A9; Story B: The First Dialogue Cycle Scenes B1–B28
- **Daily movement:** Job is introduced as perfect and upright before the narrative reveals the heavenly challenge concerning whether he fears God for nothing. Two waves of testing strip away his possessions, children, health, and domestic encouragement, yet the narrator twice declares that Job does not sin. The day ends with his friends sitting silently beside him for seven days. The complete prose prologue establishes what neither Job nor his friends know: his suffering cannot be explained as punishment for hidden wickedness. Job breaks the silence by cursing the day of his birth and asking why unwanted life is given to the miserable. Eliphaz answers with the first statement of the friends’ governing assumption: the innocent do not perish, and suffering should be received as divine correction. Job replies that his anguish gives cause for his words, compares his friends to a disappearing stream, and turns directly toward God in protest. The reading ends with Job asking why God scrutinizes frail humanity so relentlessly. This preserves the opening lament and the complete Eliphaz–Job exchange.
- **Why it begins and ends here:** The heavenly test and earthly losses lead directly into Job’s lament and the first speeches, keeping the crisis with its first attempted interpretation. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 3,120 words; 15.6 min reading; 20.1 min audio
- **Review:** Yellow boundary; Elevated load
- **v0.2 change:** Combines v0.1 Days 194 and 195.

### Day 171 — June 20 — Is There a Daysman? The First Debate Deepens

- **Reading:** Job 8:1–14:22
- **Included structure:** Story B Scenes B29–B46; Story B Scenes B47–B65
- **Daily movement:** Bildad insists that God does not pervert justice and even invokes the deaths of Job’s children as evidence of their guilt. Job agrees that no mortal can contend with God’s power, but he rejects the friends’ neat moral equation: in his experience, destruction overtakes both the blameless and the wicked. He longs for a daysman who could stand between himself and God, then pleads with the Creator who fashioned him. The day ends with Job asking for a little relief before entering the land of darkness. Zophar claims that Job is receiving less punishment than he deserves and offers restoration if he will repent. Job answers with sarcasm, affirms that God’s wisdom and power exceed theirs, and accuses the friends of speaking falsely on God’s behalf. He resolves to argue his case directly before God. His reply closes with a meditation on mortality: a felled tree may sprout again, but human hope appears to be worn away like stone under water. This completes the entire first dialogue cycle.
- **Why it begins and ends here:** Bildad and Zophar’s first speeches and Job’s replies complete the first debate cycle without isolating one exchange. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,845 words; 14.2 min reading; 18.4 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 196 and 197.

### Day 172 — June 21 — My Witness Is in Heaven: The Second Debate

- **Reading:** Job 15:1–21:34
- **Included structure:** Story C: The Second Dialogue Cycle Scenes C1–C14; Story C Scenes C15–C38
- **Daily movement:** Eliphaz abandons his earlier restraint and argues that Job’s own words condemn him. His portrait of the terrified wicked man becomes an implicit portrait of Job. Job calls the friends miserable comforters and describes himself as God’s target, yet amid abandonment he appeals to a witness and record in heaven. The reading ends with Job asking where his hope can now be found. This completes the second Eliphaz–Job exchange. Bildad describes the extinction of the wicked in language cruelly resembling Job’s losses. Job answers from utter isolation but reaches toward his great confession that his living Redeemer will finally stand and that he himself will see God. Zophar again insists that wicked prosperity is brief, but Job confronts the argument with observable reality: wicked people often live securely, prosper, and die in peace. The day ends with Job declaring the friends’ answers false because their theory cannot contain the evidence.
- **Why it begins and ends here:** The second cycle of speeches is retained as a single escalating movement ending with Job’s answer to his friends. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 3,046 words; 15.2 min reading; 19.7 min audio
- **Review:** Green boundary; Elevated load
- **v0.2 change:** Combines v0.1 Days 198 and 199.

### Day 173 — June 22 — He Knoweth My Way—but Where Shall Wisdom Be Found?

- **Reading:** Job 22:1–28:28
- **Included structure:** Story D: The Third Dialogue Cycle and Wisdom’s Interlude Scenes D1–D15; Story D Scenes D16–D28
- **Daily movement:** Eliphaz now invents specific crimes to explain Job’s suffering, accusing him of exploitation, neglect of the poor, and contempt for God. Job does not confess to fabricated guilt; he longs to find God, present his case, and be tried. He affirms that God knows his way and that he has treasured God’s words, yet remains troubled by God’s hiddenness. Job then catalogs public injustice that appears to proceed without immediate judgment. The day ends with his challenge to anyone who can prove his account false. Bildad’s final speech is only six verses, and Zophar never speaks again: the ordered dialogue has broken down. Job mocks the friends’ inability to help, praises the incomprehensible power of God, and maintains his oath of integrity. The wisdom poem then compares humanity’s remarkable ability to mine the hidden earth with its inability to discover cosmic wisdom. The movement ends with its answer: God alone knows wisdom’s way, while humanity’s proper wisdom is to fear the Lord and depart from evil.
- **Why it begins and ends here:** The third exchange leads into the poem on inaccessible wisdom, allowing the failed debate to reach its reflective conclusion. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,367 words; 11.8 min reading; 15.3 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 200 and 201.

### Day 174 — June 23 — I Made a Covenant with Mine Eyes

- **Reading:** Job 29:1–31:40
- **Included structure:** Story E: Job’s Legal Summation Scenes E1–E20
- **Daily movement:** Job contrasts three conditions: his former honor, his present humiliation, and his sworn innocence. He remembers defending the poor, fatherless, blind, and oppressed; describes becoming an object of ridicule; and then submits an extensive oath covering lust, dishonesty, adultery, treatment of servants, neglect of the poor, trust in wealth, idolatry, hatred, and concealed sin. The reading ends with his signed demand that the Almighty answer him and the explicit colophon, “The words of Job are ended.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,609 words; 8.0 min reading; 10.4 min audio
- **Review:** Green boundary; Normal load

### Day 175 — June 24 — Elihu Speaks: Consider the Wondrous Works of God

- **Reading:** Job 32:1–37:24
- **Included structure:** Story F: The Speeches of Elihu Scenes F1–F20; Story F Scenes F21–F36
- **Daily movement:** Elihu enters angry with Job for justifying himself and with the friends for condemning Job without answering him. After defending his right to speak despite his youth, he argues that God communicates in more than one way and may use suffering to warn, instruct, humble, and rescue rather than merely punish. His second speech defends God’s impartial justice and universal knowledge. The day ends with Elihu’s severe judgment that Job has spoken without knowledge and added rebellion to his complaint. Elihu argues that human righteousness or wickedness cannot enrich or diminish the transcendent God, though it profoundly affects other people. He develops his claim that God opens ears through affliction and urges Job not to turn suffering into rebellion. His speech then rises into a storm hymn: rain, lightning, thunder, snow, ice, wind, and clouds move under purposes humanity cannot fully trace. The gathering storm leads directly to God’s appearance, while Elihu ends by confessing that the Almighty is beyond human discovery.
- **Why it begins and ends here:** Elihu’s speeches are heard as one sustained intervention and end when he summons Job to stand still before God’s works. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Story
- **KJV load:** 2,666 words; 13.3 min reading; 17.2 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 203 and 204.

### Day 176 — June 25 — The LORD Answers; Job Sees and Repents

- **Reading:** Job 38:1–42:17
- **Included structure:** Story G: The Divine Answer and the Epilogue Scenes G1–G18; Story G Scenes G19–G33
- **Daily movement:** The LORD answers from the whirlwind—not by explaining the heavenly wager, but by questioning Job about creation’s foundations, boundaries, weather, constellations, wild animals, and hidden processes. The questions reveal a world governed with wisdom far beyond human perception and filled with creatures that do not exist merely for human usefulness. After the first divine speech, Job acknowledges his smallness, places his hand over his mouth, and refuses to answer further. The LORD renews the challenge by asking whether Job can humble the proud and save himself. Behemoth and Leviathan embody powers Job cannot domesticate but God can govern. Job responds by confessing that he spoke of matters too wonderful for him and that encounter has replaced hearsay. The prose epilogue then vindicates Job against the friends, requires his intercession for them, restores his fortunes, and closes with Job dying old and full of days. The book ends with relationship and vindication, not with a disclosed mechanical explanation of suffering.
- **Why it begins and ends here:** God’s speeches, Job’s final answer, vindication, intercession, and restoration form the indivisible conclusion of the book. The internal former-day pause remains available as orientation metadata, but no repository scene is divided.
- **Endpoint:** Book
- **KJV load:** 2,445 words; 12.2 min reading; 15.8 min audio
- **Review:** Green boundary; Normal load
- **v0.2 change:** Combines v0.1 Days 205 and 206.

### Day 177 — June 26 — Blessed Is the Man; Blessed Are All They That Trust

- **Reading:** Psalms 1–8
- **Included structure:** Book/Story A: Book I—The Struggle of the Righteous King Scenes A1–A23
- **Daily movement:** Psalms 1–2 form the Psalter’s double gateway: delight in the law of the LORD and allegiance to His anointed King. Psalms 3–7 introduce Davidic lament, danger, prayer, and trust. Psalm 8 then widens the vision from personal conflict to humanity’s honored place beneath God’s majestic rule. The reading ends with the repeated confession, “O LORD our Lord, how excellent is thy name in all the earth!”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,606 words; 8.0 min reading; 10.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 178 — June 27 — Keep Me as the Apple of the Eye

- **Reading:** Psalms 9–17
- **Included structure:** Book/Story A Scenes A24–A48
- **Daily movement:** Psalms 9–10 move from thanksgiving for judgment into protest over the apparent triumph of the wicked. The following psalms ask who may dwell with God, contrast human corruption with divine preservation, and repeatedly seek refuge from violent enemies. Psalm 17 closes the movement with a prayer for protection and the hope of beholding God’s face in righteousness.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Scene
- **KJV load:** 1,919 words; 9.6 min reading; 12.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 179 — June 28 — The LORD Is My Rock and My Shepherd

- **Reading:** Psalms 18–25
- **Included structure:** Book/Story A Scenes A49–A82
- **Daily movement:** Psalm 18 celebrates deliverance through an immense royal victory song. Psalms 19–22 move through creation, Torah, kingship, distress, and the forsaken sufferer whose deliverance reaches the nations. Psalm 23 answers with the Shepherd’s presence; Psalm 24 welcomes the King of glory; and Psalm 25 closes with an alphabetic prayer for guidance, forgiveness, and covenant mercy.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Scene
- **KJV load:** 2,892 words; 14.5 min reading; 18.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 180 — June 29 — The LORD Is My Light and My Salvation

- **Reading:** Psalms 26–34
- **Included structure:** Book/Story A Scenes A83–A123
- **Daily movement:** The movement begins with prayers for examination, vindication, and nearness to God’s house. It passes through the voice of the LORD over the waters, thanksgiving for deliverance from death, refuge amid conspiracy, confession and forgiveness, and praise for God’s sovereign word. Psalm 34 concludes by inviting the congregation to taste and see that the LORD is good and by affirming His nearness to the brokenhearted.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Scene
- **KJV load:** 2,629 words; 13.1 min reading; 17.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 181 — June 30 — Blessed Is He That Considereth the Poor

- **Reading:** Psalms 35–41
- **Included structure:** Book/Story A Scenes A124–A166
- **Daily movement:** These psalms move through pleas against false accusers, contemplation of human wickedness and divine mercy, patience under apparent injustice, confession, mortality, and deliverance from enemies. Psalm 41 gathers several Book I concerns—sickness, betrayal, mercy, enemies, and care for the weak—before the explicit doxology: “Blessed be the LORD God of Israel from everlasting, and to everlasting. Amen, and Amen.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,816 words; 14.1 min reading; 18.2 min audio
- **Review:** Green boundary; Normal load

### Day 182 — July 1 — Why Art Thou Cast Down, O My Soul?

- **Reading:** Psalms 42–49
- **Included structure:** Book/Story B: Book II—The Elohistic Collection Scenes B1–B28
- **Daily movement:** The Korahite collection begins with thirst for God and the repeated command to hope despite inward collapse. Longing for the sanctuary gives way to royal celebration, refuge in the city of God, universal kingship, and meditation on wealth’s inability to redeem a life from death. Psalm 49 closes the collection’s opening movement by contrasting temporary human honor with God’s power to redeem from the grave.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,181 words; 10.9 min reading; 14.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 183 — July 2 — Create in Me a Clean Heart

- **Reading:** Psalms 50–57
- **Included structure:** Book/Story B Scenes B29–B62
- **Daily movement:** God summons the covenant community to judgment in Psalm 50, rejecting empty ritual without thanksgiving and obedience. Psalm 51 answers with confession, cleansing, inward renewal, and restored praise. The remaining psalms confront boastful evil, practical atheism, betrayal, fear, exile, and persecution while repeatedly taking refuge beneath God’s mercy. Psalm 57 ends with steadfast praise rising above danger.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Scene
- **KJV load:** 2,174 words; 10.9 min reading; 14.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 184 — July 3 — My Soul, Wait Thou Only upon God

- **Reading:** Psalms 58–65
- **Included structure:** Book/Story B Scenes B63–B91
- **Daily movement:** Appeals for righteous judgment lead into prayers against violent enemies and confidence that God remains a defense. Psalms 61–63 seek shelter, silence, and satisfaction in God alone. Psalms 64–65 move from secret human plots to public divine abundance: God hears prayer, forgives iniquity, stills tumult, and crowns the year with goodness. The movement therefore ends not with enemies but with creation rejoicing.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Scene
- **KJV load:** 1,884 words; 9.4 min reading; 12.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 185 — July 4 — His Name Shall Endure for Ever

- **Reading:** Psalms 66–72
- **Included structure:** Book/Story B Scenes B92–B128
- **Daily movement:** The nations are summoned to praise God for deliverance, blessing, and His rule over all the earth. Individual thanksgiving and communal song lead into prayers for rescue, aging, and continued testimony. Psalm 72 presents the ideal royal son whose righteous reign defends the poor, brings peace, and blesses every nation. The book ends with a double doxology and the colophon, “The prayers of David the son of Jesse are ended.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,802 words; 14.0 min reading; 18.1 min audio
- **Review:** Green boundary; Normal load

### Day 186 — July 5 — Until I Went into the Sanctuary of God

- **Reading:** Psalms 73–78
- **Included structure:** Book/Story C: Book III—The Crisis of Faith Scenes C1–C32
- **Daily movement:** Psalm 73 enters Book III through the crisis of the wicked prospering, resolved only when the psalmist enters the sanctuary and perceives their end. Psalms 74–77 confront national ruin, divine silence, judgment, fear, and the struggle to remember God’s former works. Psalm 78 then retells Israel’s history as a warning against forgetting, rebellion, and an unprepared heart, ending with God’s choice of David as shepherd.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,816 words; 14.1 min reading; 18.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 187 — July 6 — That Men May Know That Thou Art the Most High

- **Reading:** Psalms 79–83
- **Included structure:** Book/Story C Scenes C33–C53
- **Daily movement:** The Asaphite national laments continue with Jerusalem defiled, the people pleading for restoration, and God’s flock demanding justice against hostile nations. Psalm 81 recalls the Exodus and exposes Israel’s refusal to listen. Psalm 82 places unjust rulers beneath God’s judgment, while Psalm 83 gathers surrounding enemies into one final plea that they may be confounded and brought to know the LORD as Most High.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,322 words; 6.6 min reading; 8.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 188 — July 7 — How Amiable Are Thy Tabernacles

- **Reading:** Psalms 84–89
- **Included structure:** Book/Story C Scenes C54–C83
- **Daily movement:** Longing for God’s courts and confidence in restored favor open the final movement of Book III. Prayers for revival and protection accompany celebrations of Zion, divine uniqueness, and lifelong mercy. Psalm 89 then praises the Davidic covenant before confronting its apparent collapse: the crown is cast down and the anointed king is shamed. The unresolved lament ends with the book’s doxology, “Blessed be the LORD for evermore. Amen, and Amen.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,096 words; 10.5 min reading; 13.5 min audio
- **Review:** Green boundary; Normal load

### Day 189 — July 8 — From Everlasting to Everlasting, Thou Art God

- **Reading:** Psalms 90–96
- **Included structure:** Book/Story D: Book IV—The LORD Reigns Scenes D1–D27
- **Daily movement:** Moses’ prayer places human frailty beneath God’s eternity and asks for wisdom to number our days. Psalm 91 answers with refuge under divine protection; Psalm 92 celebrates Sabbath praise; and Psalms 93–96 proclaim the LORD’s kingship over seas, peoples, idols, and the whole created order. The movement ends with heaven, earth, sea, fields, and trees rejoicing because the LORD comes to judge in righteousness.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,755 words; 8.8 min reading; 11.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 190 — July 9 — Bless the LORD, O My Soul

- **Reading:** Psalms 97–103
- **Included structure:** Book/Story D Scenes D28–D50
- **Daily movement:** The enthronement psalms continue: the LORD reigns, defeats idols, judges with equity, and remains holy above all peoples. Psalms 101–102 turn toward righteous government, affliction, and Zion’s future restoration. Psalm 103 gathers the movement into personal and cosmic praise for forgiveness, healing, redemption, compassion, and covenant mercy extending from everlasting to everlasting.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Scene
- **KJV load:** 1,603 words; 8.0 min reading; 10.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 191 — July 10 — Remember Me, O LORD, with the Favour of Thy People

- **Reading:** Psalms 104–106
- **Included structure:** Book/Story D Scenes D51–D72
- **Daily movement:** Psalm 104 praises God’s continuing governance of creation: light, waters, mountains, animals, seasons, food, breath, life, and death. Psalms 105–106 then recount Israel’s history from complementary directions—God’s unwavering covenant faithfulness and Israel’s repeated rebellion. Confession ends in a plea for gathering and deliverance, followed by Book IV’s doxology: “Blessed be the LORD God of Israel from everlasting to everlasting.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,992 words; 10.0 min reading; 12.9 min audio
- **Review:** Green boundary; Normal load

### Day 192 — July 11 — Oh That Men Would Praise the LORD for His Goodness

- **Reading:** Psalms 107–112
- **Included structure:** Book/Story E: Book V—The Hallelujah and Ascent Scenes E1–E24
- **Daily movement:** Psalm 107 celebrates gathered exiles and four groups delivered from distress, each summoned to praise God’s steadfast goodness. Davidic songs then seek victory, judgment, and the enthronement of the priestly king. Psalms 111–112 form an alphabetic pair: the works and righteousness of the LORD are mirrored in the character of the person who fears Him.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,934 words; 9.7 min reading; 12.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 193 — July 12 — The Stone Which the Builders Refused

- **Reading:** Psalms 113–118
- **Included structure:** Book/Story E Scenes E25–E47
- **Daily movement:** The Egyptian Hallel begins and ends with “Praise ye the LORD.” It celebrates God lifting the poor, the Exodus, deliverance from death, confidence against human fear, and thanksgiving at the gates of righteousness. Psalm 118 climaxes with the rejected stone becoming the head of the corner and with the festal cry, “Blessed be he that cometh in the name of the LORD.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,307 words; 6.5 min reading; 8.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 194 — July 13 — O How Love I Thy Law!

- **Reading:** Psalm 119
- **Included structure:** Book/Story E Scenes E48–E69
- **Daily movement:** The Psalter’s great alphabetic meditation receives a complete day. Its twenty-two eight-verse stanzas explore affliction, delight, memory, obedience, persecution, hope, understanding, and the life-giving power of God’s law, testimonies, precepts, statutes, judgments, commandments, and word. The day ends with the psalmist as a wandering sheep still seeking the Shepherd whose commandments he has not forgotten.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,445 words; 12.2 min reading; 15.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 195 — July 14 — I Will Lift Up Mine Eyes unto the Hills

- **Reading:** Psalms 120–134
- **Included structure:** Book/Story E Scenes E70–E93
- **Daily movement:** The fifteen Songs of Ascents form a complete pilgrimage collection. The journey begins amid lying lips and distant exile, rises through confidence in the Keeper of Israel, enters Jerusalem with joy, remembers deliverance, builds household and community, waits through darkness, celebrates forgiveness, embraces humble trust and Davidic promise, and ends with servants blessing the LORD by night in the sanctuary.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,704 words; 8.5 min reading; 11.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 196 — July 15 — His Mercy Endureth for Ever

- **Reading:** Psalms 135–145
- **Included structure:** Book/Story E Scenes E94–E142
- **Daily movement:** Psalms 135–136 praise God’s superiority over idols and recount creation and redemption through the refrain of enduring mercy. Exile, memory, thanksgiving, divine knowledge, protection, lament, instruction, and prayer then lead through the final Davidic collection. Psalm 145 closes that collection by praising God’s everlasting kingdom, abundant goodness, compassion, nearness, and universal worthiness to be praised.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,954 words; 14.8 min reading; 19.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 197 — July 16 — Let Every Thing That Hath Breath Praise the LORD

- **Reading:** Psalms 146–150
- **Included structure:** Book/Story E Scenes E143–E160
- **Daily movement:** The Psalter ends with five psalms framed by repeated Hallelujahs. Praise moves from personal trust beyond mortal princes to God’s care for the oppressed, Jerusalem’s restoration, the ordering of creation, the congregation’s joyful worship, and finally every instrument and every living breath. Psalm 150 serves simultaneously as the ending of Book V and the doxology of the entire Psalter.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 907 words; 4.5 min reading; 5.9 min audio
- **Review:** Green boundary; Light load

### Day 198 — July 17 — Trust in the LORD with All Thine Heart

- **Reading:** Proverbs 1:1–4:27
- **Included structure:** Story A: The Father’s Call to Wisdom Scenes A1–A30
- **Daily movement:** The book’s purpose and governing motto—the fear of the LORD as the beginning of knowledge—introduce a father’s instruction against violent companionship and Wisdom’s public appeal to the simple. Wisdom must be sought like hidden treasure, trusted above personal understanding, and guarded as life itself. The reading ends with the body directed toward one path: keep the heart diligently, look straight ahead, ponder the feet, and turn away from evil. This completes the opening curriculum on acquiring and preserving wisdom before the extended warnings about sexual folly.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,787 words; 8.9 min reading; 11.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 199 — July 18 — Wisdom Hath Builded Her House

- **Reading:** Proverbs 5:1–9:18
- **Included structure:** Story A Scenes A31–A64
- **Daily movement:** The father contrasts marital faithfulness with the deadly road of the forbidden woman, then adds practical warnings about debt, laziness, discord, and adultery. The observed seduction of the simple young man in chapter 7 gives the warnings narrative form. Lady Wisdom then calls publicly, declares her value and role in righteous rule, and stands beside God’s ordering of creation. Chapter 9 closes the prologue with two rival feasts: Wisdom offers life, while Folly’s guests descend toward death.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,161 words; 10.8 min reading; 13.9 min audio
- **Review:** Green boundary; Normal load

### Day 200 — July 19 — The Wise and the Foolish

- **Reading:** Proverbs 10:1–14:35
- **Included structure:** Story B: The Proverbs of Solomon Scenes B1–B28
- **Daily movement:** The explicit heading “The proverbs of Solomon” begins the book’s principal couplet collection. Short antithetical sayings repeatedly contrast wisdom and folly, righteousness and wickedness, diligence and sloth, truthful and destructive speech, generosity and greed, humility and pride. The reading ends with the king’s favor toward a wise servant and shame upon the one who causes disgrace, completing the collection’s first broad gallery of moral contrasts.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,499 words; 12.5 min reading; 16.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 201 — July 20 — Death and Life Are in the Power of the Tongue

- **Reading:** Proverbs 15:1–18:24
- **Included structure:** Story B Scenes B29–B49
- **Daily movement:** A soft answer turning away wrath opens a sustained examination of speech, correction, counsel, family, friendship, conflict, and the inward condition from which words proceed. Pride precedes destruction, the human spirit may endure infirmity, and an offended brother can become harder to recover than a fortified city. The movement ends by contrasting destructive companionship with the friend who cleaves closer than a brother.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,944 words; 9.7 min reading; 12.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 202 — July 21 — A Good Name Is Rather to Be Chosen

- **Reading:** Proverbs 19:1–22:16
- **Included structure:** Story B Scenes B50–B68
- **Daily movement:** These sayings concentrate on integrity, wealth and poverty, household order, discipline, anger, planning, kingship, generosity, and responsibility toward the vulnerable. Human plans remain subordinate to the LORD’s counsel, and unequal social standing never erases the fact that rich and poor share one Maker. The reading ends with the warning that both oppressing the poor for gain and flattering the rich lead to want. Proverbs 22:16 closes the primary Solomonic couplet collection immediately before the new heading at 22:17.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,782 words; 8.9 min reading; 11.5 min audio
- **Review:** Green boundary; Normal load

### Day 203 — July 22 — Incline Thine Ear unto the Words of the Wise

- **Reading:** Proverbs 22:17–24:34
- **Included structure:** Story C: The Thirty Sayings of the Wise Scenes C1–C23
- **Daily movement:** A new introductory appeal marks a change from short couplets to developed instructions. The sayings address treatment of the poor, restraint before rulers, debt, discipline, appetite, envy, drunkenness, sexual temptation, justice, courage, and the future of the righteous. A supplemental collection begins at 24:23 and ends with the observer passing the sluggard’s overgrown field, considering it carefully, and receiving instruction from its ruin.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,364 words; 6.8 min reading; 8.8 min audio
- **Review:** Green boundary; Normal load

### Day 204 — July 23 — Iron Sharpeneth Iron

- **Reading:** Proverbs 25:1–29:27
- **Included structure:** Story D: Hezekiah’s Collection of Solomonic Proverbs Scenes D1–D36
- **Daily movement:** The men of Hezekiah introduce a newly copied Solomonic collection shaped by courtly judgment, vivid comparisons, friendship, measured speech, self-control, work, leadership, treatment of the poor, and the dangers of folly. Images such as apples of gold, coals of fire, a broken-walled city, a returning dog, faithful wounds, and sharpening iron make the instruction memorable. The collection ends by opposing the fear of man to trust in the LORD and by locating final judgment beyond merely human favor.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,394 words; 12.0 min reading; 15.4 min audio
- **Review:** Green boundary; Normal load

### Day 205 — July 24 — A Woman That Feareth the LORD, She Shall Be Praised

- **Reading:** Proverbs 30:1–31:31
- **Included structure:** Story E: The Words of Agur Scenes E1–E9 Story F: The Words of Lemuel and the Excellent Wife Scenes F1–F8
- **Daily movement:** Agur confesses human limitation, submits to God’s pure word, and prays for neither poverty nor riches. His numerical sayings examine insatiability, mystery, social disorder, small creatures displaying wisdom, stately movement, and anger producing strife. Lemuel’s mother then instructs the king to reject dissipation and defend the poor. The final alphabetic poem embodies wisdom in an excellent woman whose strength, enterprise, generosity, speech, household care, and fear of the LORD cause her works to praise her publicly.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,107 words; 5.5 min reading; 7.1 min audio
- **Review:** Green boundary; Normal load

### Day 206 — July 25 — To Every Thing There Is a Season

- **Reading:** Ecclesiastes 1:1–4:16
- **Included structure:** Story A: The Narrator's Frame, Scene A1; Story B: Qoheleth's Personal Quest for Meaning, Scenes B1–B10; Story C: The Poem of Times and Observations on Oppression, Scenes C1–C10
- **Daily movement:** The narrator announces the book's governing claim—“Vanity of vanities”—before Qoheleth asks what lasting profit human labor produces. He tests wisdom, pleasure, achievement, wealth, and toil but discovers that death overtakes wise and foolish alike. Enjoyment nevertheless appears as God's gift. The poem of times then places human activity beneath divine appointment, while observations of injustice, oppression, envy, isolation, companionship, and unstable political popularity expose life's contradictions. The day ends with another explicit vanity conclusion at Ecclesiastes 4:16.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,011 words; 10.1 min reading; 13.0 min audio
- **Review:** Green boundary; Normal load

### Day 207 — July 26 — Better Is the End of a Thing Than the Beginning Thereof

- **Reading:** Ecclesiastes 5:1–8:17
- **Included structure:** Story D: Observations on Wisdom, Wealth, and Justice; Scenes D1–D20
- **Daily movement:** Qoheleth begins with reverence in worship: hear before speaking, fulfill vows, and fear God. He then examines wealth that cannot satisfy, possessions that injure their owner, riches that cannot be carried beyond death, and the tragedy of receiving abundance without the ability to enjoy it. “Better-than” sayings commend mourning, patience, correction, and sober wisdom, while the apparent prosperity of the wicked continues to trouble easy explanations of justice. The movement ends by confessing that no degree of labor or wisdom enables a person to discover fully the work God performs under the sun.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,966 words; 9.8 min reading; 12.7 min audio
- **Review:** Green boundary; Normal load

### Day 208 — July 27 — Remember Now Thy Creator

- **Reading:** Ecclesiastes 9:1–12:14
- **Included structure:** Story E: The Final Exhortation in Light of Certain Death, Scenes E1–E14; Story A: The Narrator's Frame, Scenes A2–A3
- **Daily movement:** Because death comes to righteous and wicked alike, Qoheleth urges the living to receive food, marriage, work, and ordinary joy as present gifts rather than waiting for control they do not possess. Time and chance overturn human expectations, and wisdom may save a city yet leave its possessor forgotten. The exhortation rises from acting amid uncertainty to rejoicing under coming judgment and remembering the Creator before youth, strength, sight, hearing, and desire fail. After the silver cord is loosed and the spirit returns to God, the narrator repeats the vanity refrain and gives the canonical conclusion: fear God, keep His commandments, and remember that every work will enter judgment.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,602 words; 8.0 min reading; 10.3 min audio
- **Review:** Green boundary; Normal load

### Day 209 — July 28 — Love Is Strong as Death

- **Reading:** Song of Songs 1:1–8:14
- **Included structure:** Story A: Title and Superscription, Scene A1; Story B: Mutual Desire and Admiration, Scenes B1–B9; Story C: Separation, Search, and Finding, Scenes C1–C6; Story D: Royal Wedding and Consummation, Scenes D1–D23; Story E: Concluding Poems on the Power of Love, Scenes E1–E6
- **Daily movement:** The title opens a sequence of lyric exchanges among the woman, her beloved, and the daughters of Jerusalem. Mutual desire develops through praise, insecurity, invitation, separation, searching, finding, procession, wedding, garden imagery, consummation, renewed absence, and reunion. Three recurring warnings not to awaken love prematurely close the book's principal poetic cycles. The final poems then interpret love as unquenchable, priceless, exclusive, and strong as death. The book ends not with possession becoming static but with renewed invitation: “Make haste, my beloved.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 2,658 words; 13.3 min reading; 17.1 min audio
- **Review:** Green boundary; Normal load

### Day 210 — July 29 — Though Your Sins Be as Scarlet

- **Reading:** Isaiah 1:1–4:6
- **Included structure:** Story A: The Great Arraignment Scenes A1–A27
- **Daily movement:** Isaiah’s superscription opens a covenant lawsuit against a rebellious nation whose ritual worship coexists with injustice. God calls the people to wash, reason, and choose obedience, promising purification beyond scarlet sin. Judgment upon pride is set against the future exaltation of the LORD’s mountain, the purged remnant, the Branch, and God’s protective presence over Zion. Isaiah 4:6 ends the opening arraignment with refuge restored after cleansing.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,121 words; 10.6 min reading; 13.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 211 — July 30 — Holy, Holy, Holy

- **Reading:** Isaiah 5:1–8:22
- **Included structure:** Story A Scenes A28–A53
- **Daily movement:** The beloved vineyard yields corrupt fruit, producing a sequence of woes against greed, indulgence, moral inversion, and self-exalting wisdom. Isaiah then sees the LORD enthroned, receives cleansing from the altar, and accepts his commission to a resistant people. The Syro-Ephraimite crisis tests Ahaz’s faith, introduces Immanuel and Maher-shalal-hash-baz, and contrasts occult consultation with “the law and the testimony.” The day ends in darkness produced by rejecting revealed instruction.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,480 words; 12.4 min reading; 16.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 212 — July 31 — Unto Us a Child Is Born

- **Reading:** Isaiah 9:1–12:6
- **Included structure:** Story A Scenes A54–A76
- **Daily movement:** Light dawns in Galilee through the promised child whose righteous government and peace will not end. Repeated judgments expose Israel’s refusal to return, while Assyria appears as the rod of divine anger and is itself judged for arrogant self-exaltation. From the felled forest emerges the shoot from Jesse, ruling with the Spirit, defending the poor, and bringing peace to creation. The story ends with the remnant gathered and Zion singing from the wells of salvation.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,180 words; 10.9 min reading; 14.1 min audio
- **Review:** Green boundary; Normal load

### Day 213 — August 1 — How Art Thou Fallen from Heaven

- **Reading:** Isaiah 13:1–18:7
- **Included structure:** Story B: Oracles Against the Nations Scenes B1–B33
- **Daily movement:** The burdens begin with Babylon’s fall under the day of the LORD. The taunt against its proud ruler traces ascent, self-deification, humiliation, and descent to the pit. Oracles then address Assyria, Philistia, Moab, Damascus, and the land beyond Ethiopia. The movement repeatedly brings imperial pride beneath God’s government and ends with tribute brought to Mount Zion from the distant nations.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,796 words; 14.0 min reading; 18.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 214 — August 2 — Blessed Be Egypt My People

- **Reading:** Isaiah 19:1–23:18
- **Included structure:** Story B Scenes B34–B64
- **Daily movement:** Egypt’s social, political, economic, and religious structures collapse, yet the oracle unexpectedly turns toward worship, healing, and a highway joining Egypt, Assyria, and Israel under God’s blessing. Isaiah’s sign-act warns against trusting Egypt and Ethiopia. Further burdens pronounce Babylon’s fall, question the watchman, address Arabia, expose Jerusalem’s misplaced confidence, replace Shebna with Eliakim, and conclude with Tyre’s wealth consecrated to the LORD.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,461 words; 12.3 min reading; 15.9 min audio
- **Review:** Green boundary; Normal load

### Day 215 — August 3 — He Will Swallow Up Death in Victory

- **Reading:** Isaiah 24:1–27:13
- **Included structure:** Story C: The Apocalypse of Isaiah Scenes C1–C25
- **Daily movement:** Judgment expands from individual nations to the whole earth. The ruined city, broken covenant, staggering earth, and imprisoned powers give way to the LORD reigning on Zion and preparing a feast for all peoples. Death is swallowed up, tears are removed, the dead arise, Leviathan is defeated, and the restored vineyard takes root. The story ends with the great trumpet gathering the scattered to worship at Jerusalem.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,928 words; 9.6 min reading; 12.4 min audio
- **Review:** Green boundary; Normal load

### Day 216 — August 4 — Behold, I Lay in Zion a Sure Foundation

- **Reading:** Isaiah 28:1–30:33
- **Included structure:** Story D: The Book of Woes Scenes D1–D30
- **Daily movement:** Woes fall upon Ephraim’s drunken leaders, Jerusalem’s covenant with death, Ariel’s blindness, formal worship without the heart, and rebellious children seeking security through Egypt. Against false foundations, God places a tested cornerstone in Zion. Against hurried alliances, He offers rest, quietness, confidence, gracious instruction, healing, and the voice behind the traveler saying, “This is the way, walk ye in it.” The movement ends with Assyria judged and Topheth prepared for the king.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,615 words; 13.1 min reading; 16.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 217 — August 5 — The LORD Is Our Judge, Lawgiver, and King

- **Reading:** Isaiah 31:1–33:24
- **Included structure:** Story D Scenes D31–D48
- **Daily movement:** The final woes condemn reliance upon Egyptian horses and promise that Assyria will fall without human sword. A righteous king and the outpoured Spirit transform wilderness into fruitfulness, while Zion’s destroyer faces judgment. The story ends with the LORD exalted as judge, lawgiver, king, and savior in an unshaken Jerusalem whose inhabitants are forgiven.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,343 words; 6.7 min reading; 8.7 min audio
- **Review:** Green boundary; Normal load

### Day 218 — August 6 — The Ransomed of the LORD Shall Return

- **Reading:** Isaiah 34:1–35:10
- **Included structure:** Story E: Judgment and the Ransomed Return Scenes E1–E9
- **Daily movement:** A deliberate diptych contrasts the desolation of the nations, represented by Edom, with the desert blossoming for the redeemed. Divine vengeance answers oppression; fearful hearts are strengthened; blind eyes, deaf ears, lame feet, and silent tongues are restored. The Highway of Holiness carries the ransomed toward Zion with everlasting joy, while sorrow and sighing flee away.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 799 words; 4.0 min reading; 5.2 min audio
- **Review:** Green boundary; Light load

### Day 219 — August 7 — Hezekiah Spread It before the LORD

- **Reading:** Isaiah 36:1–39:8
- **Included structure:** Story F: The Hezekiah Narrative Scenes F1–F32
- **Daily movement:** Sennacherib’s invasion places Jerusalem between imperial propaganda and trust in God. Hezekiah carries the blasphemous letter into the temple, Isaiah announces deliverance, and the Assyrian army is struck. Hezekiah then faces death, prays, receives fifteen additional years, and records his thanksgiving. The story ends on a darker turn: Babylonian envoys see his treasures, and Isaiah foretells the Babylonian exile that prepares the transition to the Book of Comfort.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,681 words; 13.4 min reading; 17.3 min audio
- **Review:** Green boundary; Normal load

### Day 220 — August 8 — Comfort Ye, Comfort Ye My People

- **Reading:** Isaiah 40:1–43:28
- **Included structure:** Story G: The Book of Comfort Scenes G1–G39
- **Daily movement:** Comfort begins with pardon, a prepared highway, the enduring word, and the incomparable Creator who strengthens the weary. God challenges idols that cannot predict or save, assures fearful Jacob of His presence, and introduces the Servant who brings justice without crushing the weak. Israel’s blindness is answered by the Creator-Redeemer’s declaration: “Fear not: for I have redeemed thee.” The movement ends with God blotting out transgressions for His own sake.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,987 words; 14.9 min reading; 19.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 221 — August 9 — Look unto Me, and Be Ye Saved

- **Reading:** Isaiah 44:1–48:22
- **Included structure:** Story G Scenes G40–G74
- **Daily movement:** God promises the Spirit, mocks the absurdity of manufactured gods, and names Cyrus as shepherd and anointed instrument of restoration. The repeated insistence that there is no God beside the LORD contrasts the Creator who carries His people with idols that must themselves be carried. Babylon falls with its astrology and enchantments unable to save. The movement ends with the new-exodus command to leave Babylon—and with the warning that there is no peace for the wicked.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 3,100 words; 15.5 min reading; 20.0 min audio
- **Review:** Yellow boundary; Elevated load

### Day 222 — August 10 — How Beautiful upon the Mountains

- **Reading:** Isaiah 49:1–52:12
- **Included structure:** Story G Scenes G75–G100
- **Daily movement:** The Servant is called from the womb to restore Jacob and become a light to the ends of the earth. Zion, fearing herself forgotten, is assured that she is engraved upon God’s hands. The obedient Servant offers his back to those who strike him and sets his face like flint. Repeated calls to awake culminate in the good-news messenger announcing, “Thy God reigneth.” The day ends with the purified people departing captivity under God’s protection, immediately before the final Servant Song begins.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,333 words; 11.7 min reading; 15.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 223 — August 11 — He Was Wounded for Our Transgressions

- **Reading:** Isaiah 52:13–55:13
- **Included structure:** Story G Scenes G101–G117
- **Daily movement:** The exalted Servant is first disfigured, despised, rejected, wounded, and led like a lamb to slaughter. He bears the sins of many, makes intercession, and is ultimately vindicated. His work opens into Zion’s expansion, everlasting kindness, an unbreakable covenant of peace, and the invitation for the thirsty to receive freely. The Book of Comfort ends with God’s effective word accomplishing its purpose and the redeemed going out with joy as creation rejoices.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,354 words; 6.8 min reading; 8.7 min audio
- **Review:** Green boundary; Normal load

### Day 224 — August 12 — My House Shall Be Called a House of Prayer

- **Reading:** Isaiah 56:1–59:21
- **Included structure:** Story H: The Book of New Creation Scenes H1–H26
- **Daily movement:** Foreigners and eunuchs are welcomed among those who keep covenant, while blind watchmen and corrupt worshipers are condemned. God dwells with the contrite and announces peace to those far and near. False fasting is contrasted with liberation, generosity, justice, and Sabbath delight. When human sin leaves truth fallen in the street and no intercessor appears, God’s own arm brings salvation. The movement ends with the Redeemer coming to Zion and with God’s Spirit and word remaining upon His people.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,041 words; 10.2 min reading; 13.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 225 — August 13 — Arise, Shine; for Thy Light Is Come

- **Reading:** Isaiah 60:1–62:12
- **Included structure:** Story H Scenes H27–H46
- **Daily movement:** Isaiah’s central Zion movement presents nations coming to Jerusalem’s light, gates remaining open, violence ending, and the LORD becoming everlasting light. The Spirit-anointed herald proclaims good tidings, liberty, comfort, restoration, and the year of the LORD’s favor. Zion receives a new name: no longer Forsaken or Desolate, but Hephzibah and Beulah. The day ends with watchmen calling without rest and a highway prepared for the Savior’s arrival.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,407 words; 7.0 min reading; 9.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 226 — August 14 — Behold, I Create New Heavens and a New Earth

- **Reading:** Isaiah 63:1–66:24
- **Included structure:** Story H Scenes H47–H78
- **Daily movement:** The divine warrior comes from Edom, and remembrance of former mercy turns into a communal lament asking God to rend the heavens. Israel confesses uncleanness and appeals to the Father and Potter. God answers by distinguishing rebellious worshipers from faithful servants and promises new heavens, a new earth, secure labor, answered prayer, and peace in creation. The book ends with Jerusalem comforted, the nations gathered, universal worship established, and the solemn judgment outside the restored city.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 2,410 words; 12.1 min reading; 15.5 min audio
- **Review:** Green boundary; Normal load

### Day 227 — August 15 — Before I Formed Thee, I Knew Thee

- **Reading:** Jeremiah 1:1–19
- **Included structure:** Story A: The Prophet’s Commission Scenes A1–A6
- **Daily movement:** Jeremiah is known, sanctified, and appointed before birth. His objection concerning youth is answered by God’s presence and words. The almond branch confirms that God watches over His word, while the boiling pot announces danger from the north. Jeremiah is commissioned to root out and pull down, but also to build and plant, and is fortified against kings, priests, and people.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 528 words; 2.6 min reading; 3.4 min audio
- **Review:** Green boundary; Light load

### Day 228 — August 16 — My People Have Committed Two Evils

- **Reading:** Jeremiah 2:1–3:25
- **Included structure:** Story B: The Great Arraignment of Judah Scenes B1–B19
- **Daily movement:** God remembers Israel’s early devotion and arraigns the nation for forsaking the fountain of living waters and digging broken cisterns. Political alliances, idolatry, and confident denials cannot conceal covenant unfaithfulness. The imagery shifts to an unfaithful wife invited to return, while the chapter ends with acknowledgment of shame and disobedience.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,821 words; 9.1 min reading; 11.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 229 — August 17 — Break Up Your Fallow Ground

- **Reading:** Jeremiah 4:1–6:30
- **Included structure:** Story B Scenes B20–B51
- **Daily movement:** The call to return becomes an urgent summons to circumcise the heart and prepare for disaster from the north. Jeremiah sees the land reverting toward primordial desolation while false assurances of peace collapse. Enemy forces approach, corrupt prophets and priests persist, and the people refuse correction. The movement ends with rejected silver: repeated refining has exposed material that will not be purified.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,562 words; 12.8 min reading; 16.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 230 — August 18 — Amend Your Ways and Your Doings

- **Reading:** Jeremiah 7:1–10:25
- **Included structure:** Story B Scenes B52–B89
- **Daily movement:** Jeremiah’s temple sermon rejects confidence in sacred buildings without justice, obedience, and repentance. Shiloh stands as warning, while child sacrifice, idolatry, and ritual hypocrisy make judgment unavoidable. Lament follows national stubbornness, and the prophet contrasts powerless idols with the living Creator. The movement closes with Jeremiah’s prayer for correction and his confession that human beings cannot independently direct their own steps.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 3,122 words; 15.6 min reading; 20.1 min audio
- **Review:** Yellow boundary; Elevated load

### Day 231 — August 19 — Can the Ethiopian Change His Skin?

- **Reading:** Jeremiah 11:1–13:27
- **Included structure:** Story B Scenes B90–B115
- **Daily movement:** The broken covenant brings judgment, while Jeremiah discovers a conspiracy against his own life. His confessions expose the cost of prophetic faithfulness and his questions concerning prosperous wickedness. Enacted signs—the ruined linen girdle and the filled wine vessels—depict Judah’s spoiled pride and coming staggering. The movement ends with the question of whether habituated evil can be changed merely by human will.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,032 words; 10.2 min reading; 13.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 232 — August 20 — The Heart Is Deceitful above All Things

- **Reading:** Jeremiah 14:1–17:27
- **Included structure:** Story B Scenes B116–B150
- **Daily movement:** Drought becomes the setting for communal lament, prophetic intercession, and conflict with prophets promising peace. God distinguishes Jeremiah’s commission from those who speak without being sent. Jeremiah’s anguish moves through persecution, loneliness, and repeated pleas for vindication. The reading contrasts trusting humanity with trusting the LORD, exposes the unknowable depths of the heart, and ends with a Sabbath test at Jerusalem’s gates.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,918 words; 14.6 min reading; 18.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 233 — August 21 — As the Clay Is in the Potter’s Hand

- **Reading:** Jeremiah 18:1–20:18
- **Included structure:** Story B Scenes B151–B172
- **Daily movement:** At the potter’s house, Jeremiah learns that announced judgment may change when a nation repents and that promised good may be withdrawn when it rebels. The broken earthen vessel then portrays irreversible destruction after persistent refusal. Pashhur strikes and imprisons Jeremiah, but suppression cannot extinguish the word burning within him. The day ends with Jeremiah’s anguished lament over his birth.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 1,794 words; 9.0 min reading; 11.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 234 — August 22 — A King Shall Reign and Prosper

- **Reading:** Jeremiah 21:1–23:40
- **Included structure:** Story B Scenes B173–B207
- **Daily movement:** As Babylon approaches, Jeremiah rejects false expectations of automatic deliverance and indicts Judah’s kings for neglecting justice. Failed shepherds scatter the flock, but God promises a righteous Branch from David who will execute judgment and righteousness. The final movement condemns prophets whose adultery, invented visions, and assurances of peace lead the people away from God’s word.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,521 words; 12.6 min reading; 16.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 235 — August 23 — Seventy Yearsand the Cup of Fury

- **Reading:** Jeremiah 24:1–25:38
- **Included structure:** Story B Scenes B208–B224
- **Daily movement:** Two baskets of figs distinguish exiles whom God will preserve and transform from those remaining under judgment. Jeremiah then summarizes twenty-three years of rejected warning and names Babylon’s seventy-year dominion. The cup of wrath expands the judgment beyond Judah to the surrounding nations and finally the whole earth. This universal desolation closes the great pre-exilic oracle collection.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,499 words; 7.5 min reading; 9.7 min audio
- **Review:** Green boundary; Normal load

### Day 236 — August 24 — The LORD Hath Sent Me to Prophesy

- **Reading:** Jeremiah 26:1–29:32
- **Included structure:** Story C: Prophetic Conflict and Resistance Scenes C1–C32
- **Daily movement:** Jeremiah’s temple preaching places him on trial for his life, but precedent and public testimony preserve him. The yoke sign warns Judah and surrounding kings to submit to Babylon. Hananiah breaks Jeremiah’s wooden yoke and promises rapid restoration, only to receive judgment for teaching rebellion. Jeremiah’s letter instructs the exiles to build, plant, marry, seek Babylon’s peace, and await God’s appointed return. The story ends with judgment upon Shemaiah’s unauthorized prophecy.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 3,107 words; 15.5 min reading; 20.0 min audio
- **Review:** Green boundary; Elevated load

### Day 237 — August 25 — I Will Make a New Covenant

- **Reading:** Jeremiah 30:1–31:40
- **Included structure:** Story D: The Book of Consolation Scenes D1–D26
- **Daily movement:** Jeremiah is commanded to preserve these restoration promises in a book. Jacob’s trouble gives way to liberation, healing, rebuilding, return, singing, and Rachel’s hope for her children. God promises to plant and build, overturn the proverb of inherited sour grapes, and establish a new covenant written upon the heart, joining forgiveness with direct knowledge of the LORD. The day ends with Jerusalem rebuilt and permanently consecrated.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,011 words; 10.1 min reading; 13.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 238 — August 26 — Buy Thee My Field

- **Reading:** Jeremiah 32:1–33:26
- **Included structure:** Story D Scenes D27–D50
- **Daily movement:** During Jerusalem’s siege, Jeremiah purchases a field as an embodied promise that houses, fields, and vineyards will again be possessed. His prayer confesses that nothing is too hard for God, and God answers with both unavoidable judgment and future restoration. The story culminates in healing, cleansing, renewed joy, the righteous Branch, and covenants compared with the fixed order of day and night.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 2,274 words; 11.4 min reading; 14.7 min audio
- **Review:** Green boundary; Normal load

### Day 239 — August 27 — I Set before You Liberty

- **Reading:** Jeremiah 34:1–36:32
- **Included structure:** Story E: Narratives of the Fall Scenes E1–E25
- **Daily movement:** Jerusalem’s leaders free their Hebrew servants and then treacherously enslave them again, turning proclaimed liberty into covenant violation. The Rechabites’ obedience to ancestral instruction exposes Judah’s refusal to hear God. Jeremiah dictates the scroll to Baruch; King Jehoiakim cuts and burns it piece by piece, but the word is written again with additional judgments.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,591 words; 13.0 min reading; 16.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 240 — August 28 — Jeremiah Sunk in the Mire

- **Reading:** Jeremiah 37:1–39:18
- **Included structure:** Story E Scenes E26–E50
- **Daily movement:** During the final siege, Jeremiah is accused of desertion, imprisoned, lowered into a muddy cistern, and rescued by Ebed-melech. Zedekiah repeatedly seeks a favorable word but refuses the costly obedience that could preserve the city. Jerusalem falls, the king watches his sons die, and Judah enters exile. The movement ends with Ebed-melech promised deliverance because he trusted the LORD.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,140 words; 10.7 min reading; 13.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 241 — August 29 — Whether It Be Good, or Whether It Be Evil

- **Reading:** Jeremiah 40:1–43:13
- **Included structure:** Story E Scenes E51–E76
- **Daily movement:** Jeremiah chooses to remain with the remnant under Gedaliah, but Gedaliah is assassinated and fear of Babylon drives the survivors toward Egypt. They ask Jeremiah for God’s direction and solemnly promise obedience whether the answer seems good or evil. When commanded to remain in Judah, they accuse him of lying and carry the remnant into Egypt. Jeremiah’s hidden stones at Tahpanhes announce that Babylon’s throne will reach them there.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,579 words; 12.9 min reading; 16.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 242 — August 30 — Seekest Thou Great Things for Thyself? Seek Them Not

- **Reading:** Jeremiah 44:1–45:5
- **Included structure:** Story E Scenes E77–E90
- **Daily movement:** In Egypt, the remnant openly defends its idolatry and interprets former prosperity as evidence for continuing the worship of the queen of heaven. Jeremiah exposes the reversal: their disasters came not from abandoning idolatry but from persisting in it. The narratives close with the earlier personal oracle to Baruch, warning him not to seek greatness while God overturns the land and promising his life as a prize of war.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 1,380 words; 6.9 min reading; 8.9 min audio
- **Review:** Green boundary; Normal load

### Day 243 — August 31 — Who Is Like Me? Who Will Appoint Me the Time?

- **Reading:** Jeremiah 46:1–49:39
- **Included structure:** Story F: Oracles Against the Nations Scenes F1–F45
- **Daily movement:** The international collection addresses Egypt, Philistia, Moab, Ammon, Edom, Damascus, Kedar, Hazor, and Elam. Armies, cities, gods, rivers, pride, ease, and inherited security all fail beneath divine judgment. Yet several oracles preserve restoration beyond judgment. The day ends with Elam scattered and later restored, completing the non-Babylonian nations before the collection’s climactic oracle.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 3,388 words; 16.9 min reading; 21.9 min audio
- **Review:** Yellow boundary; Elevated load

### Day 244 — September 1 — Babylon Hath Been a Golden Cup

- **Reading:** Jeremiah 50:1–51:64
- **Included structure:** Story F Scenes F46–F89
- **Daily movement:** Babylon, formerly the instrument of judgment, now becomes the object of an immense two-chapter oracle. Israel and Judah seek the LORD together, Babylon’s idols fail, her violence returns upon her, and God summons His people to flee. The symbolic scroll is carried to Babylon, read aloud, tied to a stone, and thrown into the Euphrates: so Babylon will sink and not rise. The editorial colophon, “Thus far are the words of Jeremiah,” closes the prophetic corpus.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story
- **KJV load:** 3,313 words; 16.6 min reading; 21.4 min audio
- **Review:** Green boundary; Elevated load

### Day 245 — September 2 — So Judah Was Carried Away Captive

- **Reading:** Jeremiah 52:1–34
- **Included structure:** Story G: Historical Appendix Scenes G1–G14
- **Daily movement:** The third-person appendix confirms the fulfillment of Jeremiah’s warnings through Jerusalem’s siege, breach, destruction, temple plundering, executions, and deportations. Detailed temple measurements testify to what was lost. The book ends with a small but deliberate grace note: Jehoiachin is released from prison, his head is lifted, and he receives a continual provision at the Babylonian king’s table.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book
- **KJV load:** 1,074 words; 5.4 min reading; 6.9 min audio
- **Review:** Green boundary; Normal load

### Day 246 — September 3 — How the City Sits Alone

- **Reading:** Lamentations 1:1–2:22
- **Included structure:** Stories A–B; A. *The Widowed City*: Scenes A.1–A.4; B. *The Furious Sovereign*: Scenes B.1–B.5
- **Daily movement:** The first two complete acrostic poems present Jerusalem's fall from two complementary perspectives. Chapter 1 begins with the ruined city seen from outside, then allows Lady Zion herself to confess, grieve, and appeal. Chapter 2 identifies the terrifying agent behind the catastrophe: the Lord has acted in judgment and has become like an enemy to Zion. The reading ends after Zion's anguished appeal concerning the destruction of her children. This preserves both poems whole and completes the opening arc, “The City Fallen.” Beginning at 1:1 retains the book's title-word cry, *How?* Ending at 2:22 completes Story B and prepares for the new representative voice—“I am the man”—in 3:1.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 1,641 words; 8.2 min reading; 10.6 min audio
- **Review:** Green boundary; Normal load

### Day 247 — September 4 — Mercies in the Middle of Mourning

- **Reading:** Lamentations 3:1–5:22
- **Included structure:** Stories C–E; C. *The Suffering Representative*: Scenes C.1–C.20; D. *The Tarnished Gold*: Scenes D.1–D.5; E. *The Communal Appeal*: Scenes E.1–E.5
- **Daily movement:** The central triple acrostic follows the suffering representative into darkness, reaches the book's theological center in the Lord's mercies and faithfulness, and turns toward examination and repentance before returning to lament and appeal. Chapter 4 widens the view again, contrasting Zion's former glory with her degradation while announcing that her punishment has reached its limit. Chapter 5 abandons the alphabetic acrostic but retains twenty-two verses, as ordered grief gives way to direct communal prayer. Beginning at 3:1 respects the major change of speaker and structural center. Ending at 5:22 preserves the unresolved final tension: the community asks to be restored but still feels rejected.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 1,770 words; 8.8 min reading; 11.4 min audio
- **Review:** Green boundary; Normal load

### Day 248 — September 5 — The Glory, the Scroll, and the Watchman

- **Reading:** Ezekiel 1:1–3:27
- **Included structure:** Story A — The Chariot Vision and the Watchman’s Call | Scenes A.1–A.22
- **Daily movement:** The heavens open beside the Kebar, revealing the living creatures, wheels, throne, and likeness of the Lord’s glory. Ezekiel falls, is raised, eats the scroll, goes among the exiles, and receives his commission as Israel’s watchman. The reading begins with Ezekiel’s precisely dated inaugural vision and ends when the commissioned prophet is confined, silenced, and told that he will speak only when God opens his mouth.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 1,952 words; 9.8 min reading; 12.6 min audio
- **Review:** Green boundary; Normal load

### Day 249 — September 6 — The End Has Come

- **Reading:** Ezekiel 4:1–7:27
- **Included structure:** Story B — The Sign-Acts of the Siege | Scenes B.1–B.32
- **Daily movement:** Ezekiel enacts Jerusalem’s coming siege through the brick, iron plate, restricted food, prolonged lying down, and divided hair. The enacted warnings expand into direct oracles against the mountains, idols, land, and people. The repeated declaration that “the end is come” brings the sequence to its appointed conclusion: king, prince, priest, prophet, and people will all discover that the Lord has acted.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,385 words; 11.9 min reading; 15.4 min audio
- **Review:** Green boundary; Normal load

### Day 250 — September 7 — The Glory Departs from the City

- **Reading:** Ezekiel 8:1–11:25
- **Included structure:** Story C — The Temple Vision and the Glory Departing | Scenes C.1–C.27
- **Daily movement:** Ezekiel is transported to Jerusalem and shown successive abominations within the temple. Judgment begins at the sanctuary, the marked mourners are preserved, and fire is taken from among the cherubim. The glory that appeared beside the Kebar leaves the temple and finally stands over the mountain east of the city. The vision ends only when Ezekiel is returned to the exiles and reports everything he has seen.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,435 words; 12.2 min reading; 15.7 min audio
- **Review:** Green boundary; Normal load

### Day 251 — September 8 — No Vision Will Be Delayed

- **Reading:** Ezekiel 12:1–15:8
- **Included structure:** Story D, Scenes D.1–D.28
- **Daily movement:** Sign-acts of exile confront the proverb that judgment is perpetually delayed. Ezekiel then exposes false prophets, false assurances of peace, concealed idols, and confidence in inherited righteousness. Even Noah, Daniel, and Job could save only themselves. The movement closes with Jerusalem compared to useless vine wood fit only for burning. The endpoint completes this first collection of warnings before the extended biography of Jerusalem begins.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,488 words; 12.4 min reading; 16.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 252 — September 9 — The Child Who Became an Unfaithful Queen

- **Reading:** Ezekiel 16:1–63
- **Included structure:** Story D, Scenes D.29–D.53
- **Daily movement:** Jerusalem’s history is told as one sustained allegory: an abandoned infant is rescued, raised, adorned, married by covenant, and established as a queen—but uses God’s gifts in unfaithfulness. Judgment is deserved, yet the chapter ends beyond judgment with God remembering his covenant and promising atonement. The allegory must remain whole; dividing it would sever accusation from its astonishing covenantal conclusion.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 1,820 words; 9.1 min reading; 11.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 253 — September 10 — The Soul That Sinneth, It Shall Die

- **Reading:** Ezekiel 17:1–19:14
- **Included structure:** Story D, Scenes D.54–D.76
- **Daily movement:** The two eagles and the vine expose royal treachery, but God promises to plant his own tender cedar sprig. The proverb concerning children suffering for their fathers is then answered with an extended declaration of individual moral responsibility and God’s desire that the wicked turn and live. A lament over Judah’s princes closes the collection with the royal vine uprooted and bereft of a ruler’s sceptre.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,048 words; 10.2 min reading; 13.2 min audio
- **Review:** Green boundary; Normal load

### Day 254 — September 11 — My Sabbaths as a Sign

- **Reading:** Ezekiel 20:1–44
- **Included structure:** Story E, Scenes E.1–E.17
- **Daily movement:** When the elders come to inquire, God answers with Israel’s history of rebellion—from Egypt, through the wilderness, and into the land. Repeated rebellion is answered by repeated restraint for the sake of God’s name. The movement reaches its natural resolution with a promised new exodus, separation of the rebels, restored worship on God’s holy mountain, and Israel’s shame when grace finally makes her understand her ways.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 1,474 words; 7.4 min reading; 9.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 255 — September 12 — A Sword Sharpened for the City of Blood

- **Reading:** Ezekiel 20:45–22:31
- **Included structure:** Story E, Scenes E.18–E.44
- **Daily movement:** A fire against the southern forest becomes an unsheathed sword against Jerusalem. Babylon’s king stands at the crossroads, divination directs him toward the city, and Jerusalem’s ruler loses crown and throne until the rightful ruler comes. The indictment then names Jerusalem “the bloody city,” surveys corruption among every class, and ends with God finding no one able to stand in the gap.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 1,912 words; 9.6 min reading; 12.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 256 — September 13 — The Desire of Your Eyes

- **Reading:** Ezekiel 23:1–24:27
- **Included structure:** Story E, Scenes E.45–E.71
- **Daily movement:** The allegory of Oholah and Oholibah retells the unfaithfulness of Samaria and Jerusalem as two sisters pursuing destructive alliances. On the day Jerusalem’s siege begins, the rusted cooking pot becomes the final image of a corruption that fire must expose. Ezekiel’s wife dies, and his restrained mourning becomes a sign of the sanctuary’s destruction. The story ends with the promise that news of the city’s fall will open Ezekiel’s mouth.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,096 words; 10.5 min reading; 13.5 min audio
- **Review:** Green boundary; Normal load

### Day 257 — September 14 — Tyre Cast Down from the Mountain of God

- **Reading:** Ezekiel 25:1–28:26
- **Included structure:** Story F, Scenes F.1–F.35
- **Daily movement:** Judgment moves outward from Jerusalem to Ammon, Moab, Edom, Philistia, Tyre, and Sidon. Tyre’s commercial splendour is pictured as a magnificent ship wrecked by the east wind, while its ruler’s wisdom and beauty collapse into divine pretension. The movement ends after Sidon’s judgment with a brief promise that gathered Israel will dwell securely. This completes the neighboring-nations and Tyre-Sidon cycle before the sustained Egyptian cycle begins.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,950 words; 14.8 min reading; 19.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 258 — September 15 — Pharaoh among the Fallen

- **Reading:** Ezekiel 29:1–32:32
- **Included structure:** Story F, Scenes F.36–F.74
- **Daily movement:** Pharaoh is first portrayed as the great river monster claiming the Nile as his own, then as a broken reed on which Israel could never safely lean. Successive dated oracles announce Egypt’s humiliation, Babylon’s advance, and the collapse of Pharaoh’s power. The final laments escort Egypt into the pit alongside Assyria, Elam, Meshech, Tubal, Edom, and the other fallen nations.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 3,231 words; 16.2 min reading; 20.8 min audio
- **Review:** Green boundary; Elevated load

### Day 259 — September 16 — The Watchman and the True Shepherd

- **Reading:** Ezekiel 33:1–34:31
- **Included structure:** Story G, Scenes G.1–G.25
- **Daily movement:** Ezekiel’s watchman commission is renewed, emphasizing warning, personal responsibility, repentance, and God’s declaration that he takes no pleasure in the death of the wicked. News finally arrives that Jerusalem has fallen, vindicating the prophet’s message. Israel’s self-serving shepherds are then displaced: God himself will search for the scattered sheep and establish “one shepherd,” his servant David.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,029 words; 10.1 min reading; 13.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 260 — September 17 — Can These Bones Live?

- **Reading:** Ezekiel 35:1–37:28
- **Included structure:** Story G, Scenes G.26–G.57
- **Daily movement:** Mount Seir’s ancient hostility is judged while Israel’s mountains are promised renewed fruitfulness. Restoration comes not because Israel deserves it, but for the sake of God’s profaned holy name: clean water, a new heart, and a new spirit follow. The valley of dry bones dramatizes national resurrection, and the joined sticks promise one reunited people under one Davidic king and an everlasting covenant of peace.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,452 words; 12.3 min reading; 15.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 261 — September 18 — Gog Defeated and the Spirit Poured Out

- **Reading:** Ezekiel 38:1–39:29
- **Included structure:** Story G, Scenes G.58–G.78
- **Daily movement:** Gog’s vast coalition advances against the restored land, but God’s own wrath, earthquake, sword, pestilence, and fire defeat the invader. Weapons are burned, the dead are buried, and the land is cleansed. The entire restoration story concludes with God gathering Jacob, making his holiness known, hiding his face no longer, and pouring out his Spirit upon Israel.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 1,704 words; 8.5 min reading; 11.0 min audio
- **Review:** Green boundary; Normal load

### Day 262 — September 19 — The House Measured and Set Apart

- **Reading:** Ezekiel 40:1–42:20
- **Included structure:** Story H, Scenes H.1–H.32
- **Daily movement:** In a new dated vision Ezekiel is carried to a very high mountain, where a bronze-like guide measures the gates, courts, temple, most holy place, chambers, and surrounding enclosure. The measurement tour forms one continuous architectural movement. It ends when the complete outer boundary is measured and its purpose is stated: separating what is holy from what is common.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,900 words; 14.5 min reading; 18.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 263 — September 20 — The Glory Returns to the Temple

- **Reading:** Ezekiel 43:1–44:31
- **Included structure:** Story H, Scenes H.33–H.55
- **Daily movement:** The glory that departed eastward in chapters 10–11 now returns from the east and fills the new house. God declares the temple the place of his throne, the altar is cleansed, and worship becomes acceptable. The closed eastern gate memorializes the divine entrance, while priestly responsibilities distinguish unfaithful Levites from the faithful sons of Zadok.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 1,938 words; 9.7 min reading; 12.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 264 — September 21 — A Holy Portion and a Just Prince

- **Reading:** Ezekiel 45:1–46:24
- **Included structure:** Story H, Scenes H.56–H.75
- **Daily movement:** The restored order extends from sanctuary to land, economy, leadership, festivals, Sabbaths, inheritance, and daily worship. Priests, Levites, city, and prince each receive an ordered place. Honest measures replace exploitation, and even the prince is placed under covenantal limits. The movement ends after the tour of the kitchens where the people’s offerings are prepared.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 1,762 words; 8.8 min reading; 11.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 265 — September 22 — The River of Life and the City Where God Dwells

- **Reading:** Ezekiel 47:1–48:35
- **Included structure:** Story H, Scenes H.76–H.96
- **Daily movement:** Water flows from the temple threshold, deepens into an uncrossable river, heals the Dead Sea, and nourishes trees whose leaves serve for healing. The renewed land is apportioned among the tribes, with foreigners receiving inheritance among native Israelites. The book closes at the city’s twelve gates with its new and final name: “The LORD is there.” The returning glory has become abiding presence.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 1,825 words; 9.1 min reading; 11.8 min audio
- **Review:** Green boundary; Normal load

### Day 266 — September 23 — Ten Times Better and a Kingdom Without End

- **Reading:** Daniel 1:1–2:49
- **Included structure:** Story A, Scenes A.1–A.20
- **Daily movement:** Jerusalem’s vessels and chosen youths are carried into Babylon, where Daniel and his companions resist defilement and are found ten times better than the royal advisers. Their first test prepares for the greater crisis: Nebuchadnezzar demands both his forgotten dream and its interpretation. God reveals the mystery of the image and the stone, showing that successive human kingdoms will yield to God’s indestructible kingdom. The endpoint completes Daniel’s first rise from threatened exile to imperial authority.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,089 words; 10.4 min reading; 13.5 min audio
- **Review:** Yellow boundary; Normal load

### Day 267 — September 24 — The Fourth Man and the Humbled King

- **Reading:** Daniel 3:1–4:37
- **Included structure:** Story A, Scenes A.21–A.41
- **Daily movement:** Nebuchadnezzar erects the golden image and demands universal worship, but Daniel’s companions refuse even without a guarantee of rescue. God meets them in the furnace, and the king acknowledges their God. Yet Nebuchadnezzar must personally learn the lesson of divine sovereignty: the proud tree is cut down, the king lives like a beast, and his understanding returns only when he lifts his eyes to heaven. The two chapters form a paired testimony in which outward acknowledgment becomes personal humiliation.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,282 words; 11.4 min reading; 14.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 268 — September 25 — Weighed in the Balance, Faithful in the Den

- **Reading:** Daniel 5:1–6:28
- **Included structure:** Story A, Scenes A.42–A.58
- **Daily movement:** Belshazzar profanes the temple vessels while praising lifeless gods. The hand writes Babylon’s sentence: its ruler has been numbered, weighed, found wanting, and divided. The empire falls that very night. Under the new regime, Daniel’s incorruptible conduct provokes a conspiracy, but neither royal decree nor lions can stop his established life of prayer. Daniel is delivered, his accusers fall, and Darius publicly honors the living God.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 1,900 words; 9.5 min reading; 12.3 min audio
- **Review:** Green boundary; Normal load

### Day 269 — September 26 — The Court, the Sanctuary, and the Seventy Weeks

- **Reading:** Daniel 7:1–9:27
- **Included structure:** Story B, Scenes B.1–B.22
- **Daily movement:** Three complete visions reinterpret the succession of kingdoms from heaven’s perspective. Four beasts rise from the sea, but the heavenly court sits, the Son of Man receives dominion, and the saints inherit the kingdom. The ram, goat, and little horn then focus the conflict upon the sanctuary and its promised vindication. Finally, Daniel’s study of Jeremiah leads not to speculation but confession and prayer; Gabriel answers with the seventy-week revelation extending from restoration to Messiah, sacrifice, desolation, and covenantal fulfillment.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 2,744 words; 13.7 min reading; 17.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 270 — September 27 — The Conflict, the Resurrection, and the End

- **Reading:** Daniel 10:1–12:13
- **Included structure:** Story B, Scenes B.23–B.46
- **Daily movement:** Daniel mourns for three weeks before encountering the radiant figure beside the river. The delayed messenger unveils an unseen conflict involving the princes of Persia and Greece, then delivers the extended revelation of northern and southern powers, persecution, resistance, and the final hostile king. The vision reaches beyond political conflict to Michael’s intervention, unprecedented trouble, resurrection, judgment, purification, and Daniel’s own promised inheritance at the end of the days. Chapters 10–12 are one vision and must remain together.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,587 words; 12.9 min reading; 16.7 min audio
- **Review:** Green boundary; Normal load

### Day 271 — September 28 — The Unfaithful Wife and the Forgotten God

- **Reading:** Hosea 1:1–6:3
- **Included structure:** Stories A–B | A. *The Allegory of the Unfaithful Wife and Children*: Scenes A.1–A.13 | B. *The Covenant Lawsuit and Israel’s Fatal Ignorance*: Scenes B.1–B.10
- **Daily movement:** Hosea’s marriage and children embody Israel’s covenant unfaithfulness. Jezreel, Lo-ruhamah, and Lo-ammi announce scattering, withdrawn mercy, and broken belonging—but their names are prophetically reversed as God promises renewed marriage, mercy, and covenant identity. The symbolic marriage then becomes a formal covenant lawsuit: Israel lacks truth, mercy, and knowledge of God; priests have rejected knowledge; worship has become spiritual prostitution. The reading ends with Israel’s call to return after divine discipline, though the following passage will expose how shallow that repentance is.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,109 words; 10.5 min reading; 13.6 min audio
- **Review:** Green boundary; Normal load

### Day 272 — September 29 — How Shall I Give Thee Up?

- **Reading:** Hosea 6:4–14:9
- **Included structure:** Stories C–E | C. *Israel’s Stubborn Apostasy and Political Folly*: Scenes C.1–C.22 | D. *The Stubborn Son and the Tender Father*: Scenes D.1–D.7 | E. *The Final Confrontation and the Call to Return*: Scenes E.1–E.8
- **Daily movement:** God exposes repentance that vanishes like morning dew. Ephraim becomes an overheated oven, an unturned cake, a senseless dove, a deceitful bow, and a luxuriant but faithless vine. Political alliances cannot heal covenant sickness. The indictment then reaches its emotional center: God remembers teaching his child to walk and cries, “How shall I give thee up?” Judgment remains real, but compassion interrupts total destruction. After one final confrontation with idolatry, kingship, death, and the east wind, Hosea calls Israel to return with words of confession. God answers with healing, free love, renewed fruitfulness, and a concluding invitation to walk wisely in the Lord’s ways.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,065 words; 15.3 min reading; 19.8 min audio
- **Review:** Green boundary; Elevated load

### Day 273 — September 30 — The Day of the LORD and the Years Restored

- **Reading:** Joel 1:1–3:21
- **Included structure:** Stories A–B; A. *The Locust Plague and the Call to Lamentation*: Scenes A.1–A.10; B. *The LORD's Response: Restoration, the Spirit, and Universal Judgment*: Scenes B.1–B.11
- **Daily movement:** A devastating locust plague strips the land, interrupts temple offerings, and becomes the immediate setting for Joel's proclamation of the Day of the Lord. Priests, elders, farmers, drunkards, and the whole nation are summoned to lament, fast, assemble, and return with the heart rather than merely torn garments. At 2:18, the book turns decisively: the Lord becomes jealous for his land, answers his people, restores the lost harvests, and promises to pour out his Spirit upon all flesh. The widening vision culminates in cosmic signs, judgment among the nations, deliverance in Zion, and the Lord dwelling with his people. The entire book forms one compact movement from devastation through repentance to restoration and should remain whole.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,033 words; 10.2 min reading; 13.1 min audio
- **Review:** Green boundary; Normal load

### Day 274 — October 1 — The Lion Has RoaredPrepare to Meet Thy God

- **Reading:** Amos 1:1–4:13
- **Included structure:** Story A — The Ring of Judgment: Scenes A.1–A.11; Story B — Three Sermons of Divine Complaint: Scenes B.1–B.10
- **Daily movement:** The Lord roars from Zion as judgment circles Israel: Damascus, Philistia, Tyre, Edom, Ammon, Moab, and Judah are each condemned before the prophetic net closes upon Israel itself. Israel's election does not provide immunity; “You only have I known” becomes the reason for stricter accountability. Amos exposes violence in Samaria, corrupted worship at Bethel, luxurious oppressors, and a people who repeatedly refuse to return despite famine, drought, crop failure, plague, and military loss. The reading ends after the second “Hear this word” sermon with the summons, “Prepare to meet thy God,” followed by a doxology identifying the sovereign Creator they must meet.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major internal movement
- **KJV load:** 1,725 words; 8.6 min reading; 11.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 275 — October 2 — Let Judgment Run Down as Waters

- **Reading:** Amos 5:1–9:15
- **Included structure:** Story B: Scenes B.11–B.21; Story C — The Five Visions of Judgment: Scenes C.1–C.12; Story D — Epilogue of Restoration: Scenes D.1–D.2
- **Daily movement:** Amos begins Israel's funeral lament before the nation has physically died, then calls it to seek the Lord, hate evil, love good, and establish justice. The people desire the Day of the Lord and maintain elaborate worship, but God rejects songs and sacrifices divorced from righteousness. The five visions then move from judgments initially relented to the plumb line, summer fruit, and altar visions in which the end can no longer be postponed. Amaziah attempts to silence Amos, but the shepherd from Tekoa refuses to abandon his commission. After the final sifting of sinful Israel, the book turns unexpectedly toward restoration: David's fallen booth is raised, the land overflows with abundance, and the people are planted never again to be uprooted.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,491 words; 12.5 min reading; 16.1 min audio
- **Review:** Green boundary; Normal load

### Day 276 — October 3 — The Kingdom, the City, and the Mercy of God

- **Reading:** Obadiah 1:1–21; Jonah 1:1–4:11
- **Included structure:** Obadiah Story A: The Judgment of Esau and the Reign of Jacob, Scenes A.1–A.6; Jonah Story A: The Prophet's Flight, the Sailors' Awe, and the Strange Deliverance, Scenes A.1–A.9; Jonah Story B: The Prophet's Obedience, Nineveh's Repentance, and the Theophany, Scenes B.1–B.6
- **Daily movement:** Obadiah announces the humiliation of proud Edom, which stood aloof and profited from Jacob's calamity. The judgment expands into the Day of the Lord, when deeds return upon the doer, Zion receives deliverance, and “the kingdom shall be the LORD'S.” Jonah then tests how God's sovereignty over the nations operates when a wicked Gentile city repents. The reluctant prophet flees, pagan sailors fear the Lord, the sea and fish obey, Nineveh turns from violence, and God relents from announced destruction. The combined reading ends with God's unanswered question concerning his right to pity the city. Together the books hold divine justice and divine mercy in deliberate tension.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 1,989 words; 9.9 min reading; 12.8 min audio
- **Review:** Green boundary; Normal load

### Day 277 — October 4 — From Bethlehem to the God Who Pardons

- **Reading:** Micah 1:1–7:20
- **Included structure:** Stories A–C; A. *The LORD's Covenant Lawsuit Against Samaria and Jerusalem*: Scenes A.1–A.7; B. *The Corrupt Leaders and the Promise of the True King*: Scenes B.1–B.10; C. *The Great Covenant Lawsuit and Final Prayer*: Scenes C.1–C.9
- **Daily movement:** The Lord descends as covenant judge against Samaria and Jerusalem. Landowners devise oppression, prophets silence unwelcome truth, rulers consume the people, and religious leaders serve for profit. Yet judgment repeatedly opens into hope: a breaker leads the remnant, the mountain of the Lord rises above the nations, exiles are gathered, and a ruler comes from little Bethlehem to shepherd in the Lord's strength. The final covenant lawsuit asks what God truly requires—not extravagant sacrifice, but justice, mercy, and humble fellowship with God. After confession and waiting, Micah ends by marveling at the incomparable God who pardons iniquity, casts sins into the sea, and keeps covenant mercy with Abraham and Jacob. The whole book forms three tightly interlocking movements and should be experienced as one complete prophetic argument.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,152 words; 15.8 min reading; 20.3 min audio
- **Review:** Green boundary; Elevated load

### Day 278 — October 5 — The Avenging God and the Righteous Who Lives by Faith

- **Reading:** Nahum 1:1–3:19; Habakkuk 1:1–3:19
- **Included structure:** Nahum Stories A–C: The Wrathful God and the Storm of Judgment, Scenes A.1–A.5; Nineveh's Siege and Fall, Scenes B.1–B.4; The Harlot's Shame and Irreversible End, Scenes C.1–C.4. Habakkuk Stories A–C: The Prophet's Two Complaints and God's First Answer, Scenes A.1–A.4; God's Vision and the Five Woes, Scenes B.1–B.6; The Prophet's Trembling Faith, Scenes C.1–C.6
- **Daily movement:** Nahum announces the irreversible fall of violent Nineveh. The Lord is patient but will not acquit entrenched wickedness; the seemingly invincible city is stormed, plundered, exposed, and mourned by no one. Habakkuk then asks the question raised by such acts of judgment: how can a holy God use an even more violent empire to punish wrongdoing? God answers that Babylon's pride carries its own sentence, while the righteous lives by faith. Five woes condemn plunder, exploitation, bloodshed, humiliation, and idolatry. The prophet ends not with every historical difficulty explained, but with a vision of the Divine Warrior and a commitment to rejoice even when field, flock, and herd fail.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,759 words; 13.8 min reading; 17.8 min audio
- **Review:** Green boundary; Normal load

### Day 279 — October 6 — Seek the LORD and Consider Your Ways

- **Reading:** Zephaniah 1:1–3:20; Haggai 1:1–2:23
- **Included structure:** Zephaniah Stories A–C: The Day of the LORD Is Near, Scenes A.1–A.4; Judgment Extends to the Nations, Scenes B.1–B.4; Woe, Cleansing, and Final Restoration, Scenes C.1–C.5. Haggai Stories A–D: Call to Priority and Rebuilding, Scenes A.1–A.3; Promise of Greater Glory, Scene B.1; From Defilement to Blessing, Scenes C.1–C.2; Zerubbabel the Signet, Scene D.1
- **Daily movement:** Zephaniah announces the approaching Day of the Lord as judgment upon Judah, Jerusalem, and the surrounding nations. Yet the prophetic hourglass opens again beyond judgment: purified peoples call upon the Lord, a humble remnant trusts in his name, Zion sings, and God rejoices over his restored people. Haggai then addresses the post-exilic community that has physically returned but allowed God's house to remain desolate. “Consider your ways” turns restoration from promise into obedient action. The people rebuild, God promises his presence, the latter glory surpasses the former, defilement gives way to blessing, and Zerubbabel becomes God's signet amid the promised shaking of kingdoms.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,746 words; 13.7 min reading; 17.7 min audio
- **Review:** Green boundary; Normal load

### Day 280 — October 7 — Not by Might: The Branch and Restored Zion

- **Reading:** Zechariah 1:1–8:23
- **Included structure:** Stories A–B | A. *The Eight Night Visions and the Temple’s Hope*: Scenes A.1–A.22 | B. *The Question of Fasting and the Future of Zion*: Scenes B.1–B.9
- **Daily movement:** Zechariah begins by calling the returned community to avoid its ancestors’ refusal to hear. Eight interconnected night visions then reveal God’s renewed purpose: the nations at ease are confronted, Jerusalem is measured and protected, Joshua’s filthy garments are removed, the Branch is promised, the lampstand is supplied by the Spirit, wickedness is removed, and the crowned priest anticipates a coming priest-king. The question about commemorative fasts then tests whether restoration has changed the people’s hearts. God calls for justice, truth, and peace and promises that former fasts will become joyful feasts as nations come seeking the Lord in Jerusalem.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 3,443 words; 17.2 min reading; 22.2 min audio
- **Review:** Green boundary; Elevated load

### Day 281 — October 8 — The Humble King and the LORD Over All the Earth

- **Reading:** Zechariah 9:1–14:21
- **Included structure:** Stories C–D | C. *The First Burden: Judgment, the Lowly King, and the Worthless Shepherd*: Scenes C.1–C.14 | D. *The Second Burden: Mourning, Cleansing, and Final Battle*: Scenes D.1–D.11
- **Daily movement:** The book shifts from dated temple-era visions to two undated prophetic burdens. The first announces judgment upon hostile nations, the arrival of Zion’s humble king, the liberation of prisoners of hope, the regathering of the flock, and the exposure of the worthless shepherd. The second portrays Jerusalem surrounded yet preserved, mourning for the pierced one, a fountain opened for cleansing, the shepherd struck, and a refined remnant calling upon God. The final Day of the Lord culminates with living waters, the Lord reigning over all the earth, nations coming to worship, and even ordinary bells and cooking pots marked as holy.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,000 words; 15.0 min reading; 19.4 min audio
- **Review:** Green boundary; Normal load

### Day 282 — October 9 — My Messenger Shall Prepare the Way

- **Reading:** Malachi 1:1–4:6
- **Included structure:** Stories A–D: God's Sovereign Love Questioned, Scene A.1; The Priests' Failure and Defiled Worship, Scenes B.1–B.4; Treachery, Divorce, and the Quest for Justice, Scenes C.1–C.3; The Call to Return and the Final Exhortation, Scenes D.1–D.4
- **Daily movement:** Malachi proceeds through covenant disputations in which God speaks, the people question his charge, and their own conduct supplies the answer. They doubt God's love, priests offer polluted sacrifices, Levi's covenant is corrupted, Judah deals treacherously, marriage covenants are violated, and the people accuse God of tolerating evil. God answers by promising a messenger who will prepare the way and a Lord whose arrival will refine worship and judge oppression. The people are called to return, the faithful remnant is remembered, and the book closes with the coming Day of the Lord, the healing Sun of righteousness, the law of Moses, and Elijah's promised work of turning hearts.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 1,781 words; 8.9 min reading; 11.5 min audio
- **Review:** Green boundary; Normal load

### Day 283 — October 10 — Immanuel and the Kingdom at Hand

- **Reading:** Matthew 1:1–4:25
- **Included structure:** Matthew Story A (The Origin and Authorization of the King), scenes A.1–A.19
- **Daily movement:** Matthew introduces Jesus as Son of David and Son of Abraham, narrates his Spirit-wrought birth and preservation from Herod, and repeatedly presents events as fulfillment of Scripture. John prepares the way, Jesus is baptized and declared God’s Son, then withstands the tempter in the wilderness. He emerges proclaiming the kingdom, calling disciples, and bringing light, teaching, and healing throughout Galilee. The reading ends with the authorized king surrounded by disciples and crowds, prepared to ascend the mountain and teach.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,036 words; 10.2 min reading; 13.1 min audio
- **Review:** Green boundary; Normal load

### Day 284 — October 11 — The King’s Sermon and the Two Foundations

- **Reading:** Matthew 5:1–7:29
- **Included structure:** Matthew Story B (The King's Sermon and Call to Obedience), scenes B.1–B.25
- **Daily movement:** Jesus announces the blessedness of his kingdom, identifies disciples as salt and light, and explains that he came not to destroy the Law and Prophets but to fulfill them. He moves righteousness inward—from murder to anger, adultery to lust, retaliation to enemy-love—and reorients giving, prayer, fasting, possessions, anxiety, judgment, and petition around the Father. The sermon ends with paired gates, trees, professions, and foundations. Hearing must become obedience.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,501 words; 12.5 min reading; 16.1 min audio
- **Review:** Green boundary; Normal load

### Day 285 — October 12 — Authority to Heal, Forgive, and Send

- **Reading:** Matthew 8:1–10:42
- **Included structure:** Matthew Story C (The King's Authority Demonstrated), scenes C.1–C.27
- **Daily movement:** The authority heard in the sermon becomes visible through cleansing, healing, command over wind and sea, mastery over demons, forgiveness of sins, resurrection, and restored sight and speech. Jesus calls Matthew and sees the crowds as sheep without a shepherd. He then gives authority to the Twelve and sends them as laborers into the harvest, warning that mission will bring both provision and persecution. The movement ends by identifying the reception of Jesus’ messengers with reception of Jesus himself.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,529 words; 12.6 min reading; 16.3 min audio
- **Review:** Green boundary; Normal load

### Day 286 — October 13 — Come unto Me: Wisdom Received and Rejected

- **Reading:** Matthew 11:1–12:50
- **Included structure:** Matthew Story D (Opposition and Parables of the Kingdom), scenes D.1–D.18
- **Daily movement:** Begins with John's Question from Prison and moves through Matthew: Opposition and Parables of the Kingdom, ending with Jesus' True Family. Whoever does the will of My Father is My brother.
- **Why it begins and ends here:** The reading begins at repository scene D.1 and ends after scene D.18. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,836 words; 9.2 min reading; 11.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 287 — October 14 — Hear Ye the Mysteries of the Kingdom

- **Reading:** Matthew 13:1–13:53
- **Included structure:** Matthew Story D (Opposition and Parables of the Kingdom), scenes D.19–D.31
- **Daily movement:** Begins with Teaching from the Boat and moves through Matthew: Opposition and Parables of the Kingdom, ending with The Householder. New treasures as well as old.
- **Why it begins and ends here:** The reading begins at repository scene D.19 and ends after scene D.31. The final scene completes the repository story D. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,257 words; 6.3 min reading; 8.1 min audio
- **Review:** Green boundary; Normal load

### Day 288 — October 15 — Who Say Ye That I Am?

- **Reading:** Matthew 13:54–16:20
- **Included structure:** Matthew Story E (Identity Clarified and the Community Discourse), scenes E.1–E.24
- **Daily movement:** Begins with Rejection at Nazareth and moves through Matthew: Identity Clarified and the Community Discourse, ending with The Keys of the Kingdom. On this rock I will build My church.
- **Why it begins and ends here:** The reading begins at repository scene E.1 and ends after scene E.24. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,079 words; 10.4 min reading; 13.4 min audio
- **Review:** Yellow boundary; Normal load

### Day 289 — October 16 — The Cross and the Forgiving Community

- **Reading:** Matthew 16:21–18:35
- **Included structure:** Matthew Story E (Identity Clarified and the Community Discourse), scenes E.25–E.41
- **Daily movement:** Begins with First Passion Prediction and moves through Matthew: Identity Clarified and the Community Discourse, ending with Forgive from the Heart. So will My Father do to you.
- **Why it begins and ends here:** The reading begins at repository scene E.25 and ends after scene E.41. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,714 words; 8.6 min reading; 11.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 290 — October 17 — The Servant King Enters Jerusalem

- **Reading:** Matthew 19:1–21:22
- **Included structure:** Matthew Story F (Journey to Jerusalem, Conflict, and the Olivet Discourse), scenes F.1–F.21
- **Daily movement:** On the journey toward Jerusalem, Jesus teaches concerning marriage, celibacy, children, wealth, reward, grace, suffering, and servant leadership. The rich young man departs sorrowful, workers receive the vineyard owner’s surprising generosity, and the disciples again misunderstand greatness. Jesus declares that the Son of Man came to serve and give his life as a ransom. After restoring sight near Jericho, he enters Jerusalem as the humble king, cleanses the temple, receives children’s praise, and enacts judgment through the fruitless fig tree.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,021 words; 10.1 min reading; 13.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 291 — October 18 — The Rejected Stone and the Lament over Jerusalem

- **Reading:** Matthew 21:23–23:39
- **Included structure:** Matthew Story F (Journey to Jerusalem, Conflict, and the Olivet Discourse), scenes F.22–F.48
- **Daily movement:** Jerusalem’s leaders challenge Jesus’ authority and are answered through the two sons, the murderous tenants, and the rejected cornerstone. Further traps concerning Caesar, resurrection, and the greatest commandment fail, while Jesus’ question concerning David’s Lord silences his opponents. He then exposes leadership that shuts the kingdom, burdens others, neglects justice and mercy, and cleans only the exterior. The confrontation ends not in triumphal mockery but in Jesus’ lament over the city he desired to gather.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,264 words; 11.3 min reading; 14.6 min audio
- **Review:** Yellow boundary; Normal load

### Day 292 — October 19 — Watch, for the Son of Man Comes

- **Reading:** Matthew 24:1–25:46
- **Included structure:** Matthew Story F (Journey to Jerusalem, Conflict, and the Olivet Discourse), scenes F.49–F.70
- **Daily movement:** Jesus leaves the temple and foretells its destruction. From the Mount of Olives he describes deception, conflict, persecution, worldwide proclamation, tribulation, his coming, and the gathering of the elect. Because the time is unknown, disciples must watch like a householder, serve faithfully like a responsible steward, maintain readiness like wise virgins, and use entrusted resources like faithful servants. The discourse ends with the Son of Man enthroned as king and judge, identifying treatment of “the least of these” with treatment of himself.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,042 words; 10.2 min reading; 13.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 293 — October 20 — The Crucified King and the Great Commission

- **Reading:** Matthew 26:1–28:20
- **Included structure:** Matthew Story G (Passion, Resurrection, and the Great Commission), scenes G.1–G.37
- **Daily movement:** The plot against Jesus advances through betrayal, Passover, Gethsemane, arrest, false testimony, and Peter’s denial. Jesus is condemned, mocked, crucified, and buried while the rulers secure the tomb. At his death the veil is torn and the centurion confesses him as God’s Son. The sealed tomb cannot contain him: the women receive the resurrection announcement, Jesus meets them, and the disciples gather on the mountain. The Gospel ends with the risen king possessing all authority and sending disciples to make disciples of all nations under his continuing presence.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,405 words; 17.0 min reading; 22.0 min audio
- **Review:** Green boundary; Elevated load

### Day 294 — October 21 — Authority, Conflict, and the Family of Jesus

- **Reading:** Mark 1:1–3:35
- **Included structure:** Mark Story A (The Son of God Revealed in Power (Galilee)), scenes A.1–A.23
- **Daily movement:** Begins with Gospel Opening: The Messenger and moves through Mark: The Son of God Revealed in Power (Galilee), ending with Jesus' True Family. Whoever does the will of God is brother and sister and mother.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.23. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,317 words; 11.6 min reading; 14.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 295 — October 22 — Parables, Storm, Legion, and Talitha Koum

- **Reading:** Mark 4:1–5:43
- **Included structure:** Mark Story A (The Son of God Revealed in Power (Galilee)), scenes A.24–A.43
- **Daily movement:** Begins with Teaching from the Boat and moves through Mark: The Son of God Revealed in Power (Galilee), ending with Talitha Koum. Little girl, get up — and give her something to eat.
- **Why it begins and ends here:** The reading begins at repository scene A.24 and ends after scene A.43. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,875 words; 9.4 min reading; 12.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 296 — October 23 — Rejected, Compassionate, and Undefiled

- **Reading:** Mark 6:1–7:23
- **Included structure:** Mark Story A (The Son of God Revealed in Power (Galilee)), scenes A.44–A.60
- **Daily movement:** Begins with Rejection at Nazareth and moves through Mark: The Son of God Revealed in Power (Galilee), ending with Evil from Within. Out of the heart come the evils that defile a man.
- **Why it begins and ends here:** The reading begins at repository scene A.44 and ends after scene A.60. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,807 words; 9.0 min reading; 11.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 297 — October 24 — He Hath Done All Things Well—Do Ye Not Yet Understand?

- **Reading:** Mark 7:24–8:26
- **Included structure:** Mark Story A (The Son of God Revealed in Power (Galilee)), scenes A.61–A.70
- **Daily movement:** Begins with The Syrophoenician Woman and moves through Mark: The Son of God Revealed in Power (Galilee), ending with The Blind Man at Bethsaida. Men like trees walking; then sight fully restored.
- **Why it begins and ends here:** The reading begins at repository scene A.61 and ends after scene A.70. The final scene completes the repository story A. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 863 words; 4.3 min reading; 5.6 min audio
- **Review:** Green boundary; Light load

### Day 298 — October 25 — The Christ and the Way of the Cross

- **Reading:** Mark 8:27–10:52
- **Included structure:** Mark Story B (The Way of the Suffering Son of Man (Via Crucis)), scenes B.1–B.27
- **Daily movement:** Peter identifies Jesus as the Christ, but Jesus immediately redefines messiahship through rejection, death, resurrection, and the cross-bearing path of discipleship. The transfiguration confirms his glory, while the disciples repeatedly misunderstand faith, greatness, exclusivity, marriage, children, wealth, reward, and leadership. Three Passion predictions structure the journey. Jesus finally declares that the Son of Man came to serve and give his life as a ransom for many. The movement ends with Bartimaeus seeing clearly and following Jesus “in the way.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,683 words; 13.4 min reading; 17.3 min audio
- **Review:** Green boundary; Normal load

### Day 299 — October 26 — The Rejected Stone and the Command to Watch

- **Reading:** Mark 11:1–13:37
- **Included structure:** Mark Story C (Conflict, Authority, and the End Times (Jerusalem Ministry)), scenes C.1–C.26
- **Daily movement:** Jesus enters Jerusalem as king and inspects the temple. The fig-tree and temple actions interpret one another as judgment upon fruitless worship. Authorities challenge Jesus but are exposed through the tenants, rejected cornerstone, questions about Caesar, resurrection, the greatest commandment, and David’s Lord. The widow’s complete offering contrasts with devouring religious leadership. Jesus then foretells the temple’s destruction, persecution, worldwide witness, tribulation, and the Son of Man’s coming. Since no one knows the hour, the movement ends with the repeated command: watch.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,664 words; 13.3 min reading; 17.2 min audio
- **Review:** Green boundary; Normal load

### Day 300 — October 27 — The Crucified Son of God and the Empty Tomb

- **Reading:** Mark 14:1–16:20
- **Included structure:** Mark Story D (Passion, Crucifixion, and Empty Tomb), scenes D.1–D.33
- **Daily movement:** An unnamed woman understands the approaching burial while Judas arranges betrayal. Passover becomes covenant meal; Gethsemane reveals obedient anguish; the disciples flee; Peter denies; and the authorities condemn Jesus. Mocked as king, he is crucified in darkness. At his death the temple veil is torn and a Gentile centurion confesses him as God’s Son. The women find the stone removed and hear that Jesus has risen. In the KJV and the repository’s present structure, the reading continues through the appearances, worldwide commission, ascension, and apostolic preaching of 16:9–20.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,957 words; 14.8 min reading; 19.1 min audio
- **Review:** Green boundary; Normal load
- **Audit note:** KJV textual overlay includes Mark 16:9–20; retain an explicit textual-history note without treating it as a boundary defect.

### Day 301 — October 28 — Good Tidings of Great Joy

- **Reading:** Luke 1:1–2:52
- **Included structure:** Luke Story A (Prologue and Preparation (The Divine Overture)), scenes A.1–A.31
- **Daily movement:** Luke promises an orderly account grounded in received testimony, then interweaves the announcements and births of John and Jesus. Mary, Zechariah, angels, shepherds, Simeon, and Anna interpret the children through songs and prophetic declarations of covenant faithfulness, reversal, salvation, and light to the Gentiles. The movement ends with the twelve-year-old Jesus in his Father’s house, returning in submission and growing in wisdom and favor.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,677 words; 13.4 min reading; 17.3 min audio
- **Review:** Green boundary; Normal load

### Day 302 — October 29 — The Spirit of the Lord Is upon Me

- **Reading:** Luke 3:1–4:44
- **Included structure:** Luke Story B (Preparation for Ministry (The Baptism and Call)), scenes B.1–B.12; Luke Story C (Ministry in Galilee (Authority Demonstrated)), scenes C.1–C.7
- **Daily movement:** Begins with John's Ministry and moves through Luke: Preparation for Ministry (The Baptism and Call); Luke: Ministry in Galilee (Authority Demonstrated), ending with 'I Must Preach the Kingdom'. That is why I was sent.
- **Why it begins and ends here:** The reading begins at repository scene B.1 and ends after scene C.7. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,038 words; 10.2 min reading; 13.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 303 — October 30 — Catch Men, Love Enemies, and Build upon the Rock

- **Reading:** Luke 5:1–6:49
- **Included structure:** Luke Story C (Ministry in Galilee (Authority Demonstrated)), scenes C.8–C.27
- **Daily movement:** Begins with 'Put Out into the Deep' and moves through Luke: Ministry in Galilee (Authority Demonstrated), ending with The Two Builders. The house built on the rock stood firm.
- **Why it begins and ends here:** The reading begins at repository scene C.8 and ends after scene C.27. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,178 words; 10.9 min reading; 14.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 304 — October 31 — Great Faith, Forgiven Love, and the Word Received

- **Reading:** Luke 7:1–8:21
- **Included structure:** Luke Story C (Ministry in Galilee (Authority Demonstrated)), scenes C.28–C.45
- **Daily movement:** Begins with The Centurion's Servant and moves through Luke: Ministry in Galilee (Authority Demonstrated), ending with Jesus' True Family. Those who hear God's word and do it.
- **Why it begins and ends here:** The reading begins at repository scene C.28 and ends after scene C.45. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,726 words; 8.6 min reading; 11.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 305 — November 1 — Who Then Is This? The Christ and His Glory

- **Reading:** Luke 8:22–9:50
- **Included structure:** Luke Story C (Ministry in Galilee (Authority Demonstrated)), scenes C.46–C.68
- **Daily movement:** Begins with Calming the Storm and moves through Luke: Ministry in Galilee (Authority Demonstrated), ending with The Outsider. Whoever is not against you is for you.
- **Why it begins and ends here:** The reading begins at repository scene C.46 and ends after scene C.68. The final scene completes the repository story C. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,097 words; 10.5 min reading; 13.5 min audio
- **Review:** Green boundary; Normal load

### Day 306 — November 2 — He Set His Face toward Jerusalem

- **Reading:** Luke 9:51–11:54
- **Included structure:** Luke Story D (The Great Journey (The Path to Jerusalem)), scenes D.1–D.27
- **Daily movement:** Begins with Samaritan Rejection and moves through Luke: The Great Journey (The Path to Jerusalem), ending with They Plot Against Him. Waiting to catch Him in something He might say.
- **Why it begins and ends here:** The reading begins at repository scene D.1 and ends after scene D.27. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,597 words; 13.0 min reading; 16.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 307 — November 3 — Be Ready, Repent, and Enter the Narrow Door

- **Reading:** Luke 12:1–13:35
- **Included structure:** Luke Story D (The Great Journey (The Path to Jerusalem)), scenes D.28–D.50
- **Daily movement:** Begins with The Leaven of the Pharisees and moves through Luke: The Great Journey (The Path to Jerusalem), ending with Lament over Jerusalem. How often I have longed to gather your children.
- **Why it begins and ends here:** The reading begins at repository scene D.28 and ends after scene D.50. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,271 words; 11.4 min reading; 14.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 308 — November 4 — The Lost Are Found; Hear Moses and the Prophets

- **Reading:** Luke 14:1–16:31
- **Included structure:** Luke Story D (The Great Journey (The Path to Jerusalem)), scenes D.51–D.72
- **Daily movement:** Begins with Healing on the Sabbath and moves through Luke: The Great Journey (The Path to Jerusalem), ending with Moses and the Prophets. They will not be convinced even if one rises.
- **Why it begins and ends here:** The reading begins at repository scene D.51 and ends after scene D.72. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,289 words; 11.4 min reading; 14.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 309 — November 5 — The Kingdom among You and Faith That Endures

- **Reading:** Luke 17:1–18:30
- **Included structure:** Luke Story D (The Great Journey (The Path to Jerusalem)), scenes D.73–D.88
- **Daily movement:** Begins with On Forgiveness and moves through Luke: The Great Journey (The Path to Jerusalem), ending with 'We Have Left All'. Many times more in this age, and eternal life.
- **Why it begins and ends here:** The reading begins at repository scene D.73 and ends after scene D.88. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,424 words; 7.1 min reading; 9.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 310 — November 6 — The King Comes to Seek, Save, and Warn

- **Reading:** Luke 18:31–21:38
- **Included structure:** Luke Story E (Climax in Jerusalem (The Passion)), scenes E.1–E.34
- **Daily movement:** Jesus predicts his Passion, restores a blind beggar, brings salvation to Zacchaeus, and tells the parable of the minas before entering Jerusalem as king. He weeps over the city, cleanses the temple, and answers challenges concerning authority, tribute, resurrection, and David’s Lord. The widow’s offering contrasts with scribal exploitation. Jesus then foretells Jerusalem’s siege, persecution, worldwide testimony, cosmic signs, and the Son of Man’s coming, ending with the command to watch and pray.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 3,074 words; 15.4 min reading; 19.8 min audio
- **Review:** Yellow boundary; Elevated load

### Day 311 — November 7 — The Crucified Lord and the Scriptures Opened

- **Reading:** Luke 22:1–24:53
- **Included structure:** Luke Story E (Climax in Jerusalem (The Passion)), scenes E.35–E.66; Luke Story F (Resurrection and Conclusion (The Triumphant End)), scenes F.1–F.12
- **Daily movement:** Passover becomes the new-covenant meal, yet betrayal and rivalry remain at the table. Jesus serves, prays in anguish, is arrested, heals an enemy, looks upon denying Peter, and is rejected despite repeated declarations of innocence. At the cross he forgives, promises paradise to the repentant criminal, and entrusts himself to the Father. The women find the tomb empty; on the Emmaus road Jesus interprets Moses and all the Prophets concerning himself. The risen Christ opens the disciples’ understanding, commissions worldwide repentance and forgiveness, promises power from on high, and ascends as they return to Jerusalem with joy.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,568 words; 17.8 min reading; 23.0 min audio
- **Review:** Green boundary; Heavy load

### Day 312 — November 8 — The Word Made Flesh and the First Sign

- **Reading:** John 1:1–2:25
- **Included structure:** John Story A (The Eternal Word Made Flesh (Prologue)), scenes A.1–A.4; John Story B (The Book of Signs: Public Revelation and Mounting Conflict), scenes B.1–B.12
- **Daily movement:** Begins with Cosmic Word and the Light and moves through John: The Eternal Word Made Flesh (Prologue); John: The Book of Signs: Public Revelation and Mounting Conflict, ending with He Knew What Was in Man. Many believed at the signs, but Jesus did not entrust Himself to them.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene B.12. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,514 words; 7.6 min reading; 9.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 313 — November 9 — Born from Above and the Saviour of the World

- **Reading:** John 3:1–4:54
- **Included structure:** John Story B (The Book of Signs: Public Revelation and Mounting Conflict), scenes B.13–B.33
- **Daily movement:** Begins with Nicodemus by Night and moves through John: The Book of Signs: Public Revelation and Mounting Conflict, ending with The Fever Left at That Hour. The second sign, when He came from Judea to Galilee.
- **Why it begins and ends here:** The reading begins at repository scene B.13 and ends after scene B.33. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,857 words; 9.3 min reading; 12.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 314 — November 10 — The Son Gives Life and the Bread from Heaven

- **Reading:** John 5:1–6:71
- **Included structure:** John Story B (The Book of Signs: Public Revelation and Mounting Conflict), scenes B.34–B.58
- **Daily movement:** Jesus heals the long-disabled man at Bethesda on the Sabbath, provoking a dispute that expands into claims concerning the Son’s unity of action with the Father, authority to give life, and authority to execute judgment. John, Jesus’ works, the Father, Scripture, and Moses all testify. Jesus then feeds the multitude and walks upon the sea, but refuses political kingship. The Bread of Life discourse presses beyond appetite toward faith, participation, and abiding. Many disciples leave; Peter answers, “To whom shall we go?”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,507 words; 12.5 min reading; 16.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 315 — November 11 — Living Water, the Light, and the Truth That Frees

- **Reading:** John 7:1–8:59
- **Included structure:** John Story B (The Book of Signs: Public Revelation and Mounting Conflict), scenes B.59–B.81
- **Daily movement:** At the Feast of Tabernacles Jesus’ identity, origin, teaching, and appointed hour become matters of public division. He promises rivers of living water, interpreted as the coming Spirit. In the KJV and repository structure, the woman accused of adultery is brought before him; her accusers depart, and Jesus refuses condemnation while commanding a changed life. Jesus then declares himself the light of the world, exposes false confidence in ancestry, identifies enslavement to sin, and ends with the climactic declaration, “Before Abraham was, I am.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Major movement
- **KJV load:** 2,309 words; 11.5 min reading; 14.9 min audio
- **Review:** Yellow boundary; Normal load
- **Audit note:** KJV textual overlay includes John 7:53–8:11; retain an explicit textual-history note without treating it as a boundary defect.

### Day 316 — November 12 — The Man Born Blind and the Good Shepherd

- **Reading:** John 9:1–10:42
- **Included structure:** John Story B (The Book of Signs: Public Revelation and Mounting Conflict), scenes B.82–B.98
- **Daily movement:** Begins with Born Blind: Whose Sin? and moves through John: The Book of Signs: Public Revelation and Mounting Conflict, ending with Believe the Works. He escaped, and many beyond the Jordan believed in Him.
- **Why it begins and ends here:** The reading begins at repository scene B.82 and ends after scene B.98. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,696 words; 8.5 min reading; 10.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 317 — November 13 — The Resurrection and the Life; the Hour Has Come

- **Reading:** John 11:1–12:50
- **Included structure:** John Story B (The Book of Signs: Public Revelation and Mounting Conflict), scenes B.99–B.124
- **Daily movement:** Begins with Lazarus Is Ill and moves through John: The Book of Signs: Public Revelation and Mounting Conflict, ending with The Word That Judges. His command is eternal life — Jesus' final public words.
- **Why it begins and ends here:** The reading begins at repository scene B.99 and ends after scene B.124. The final scene completes the repository story B. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,217 words; 11.1 min reading; 14.3 min audio
- **Review:** Green boundary; Normal load

### Day 318 — November 14 — Love One Another; Let Not Your Heart Be Troubled

- **Reading:** John 13:1–14:31
- **Included structure:** John Story C (The Book of Glory: Farewell and Glorious Passion), scenes C.1–C.16
- **Daily movement:** Begins with Washing the Disciples' Feet and moves through John: The Book of Glory: Farewell and Glorious Passion, ending with 'My Peace I Give You'. Let not your hearts be troubled — rise, let us go.
- **Why it begins and ends here:** The reading begins at repository scene C.1 and ends after scene C.16. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,557 words; 7.8 min reading; 10.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 319 — November 15 — Abide in Me: The Spirit and the Prayer for Unity

- **Reading:** John 15:1–17:26
- **Included structure:** John Story C (The Book of Glory: Farewell and Glorious Passion), scenes C.17–C.35
- **Daily movement:** Begins with 'I Am the True Vine' and moves through John: The Book of Glory: Farewell and Glorious Passion, ending with 'That They May See My Glory'. That the love You have for Me may be in them.
- **Why it begins and ends here:** The reading begins at repository scene C.17 and ends after scene C.35. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,038 words; 10.2 min reading; 13.1 min audio
- **Review:** Yellow boundary; Normal load

### Day 320 — November 16 — It Is Finished—My Lord and My God

- **Reading:** John 18:1–21:25
- **Included structure:** John Story C (The Book of Glory: Farewell and Glorious Passion), scenes C.36–C.62; John Story D (Epilogue: Restoration and Final Witness), scenes D.1–D.7
- **Daily movement:** Jesus knowingly meets the arresting party, protects his disciples, and declares that his kingdom is not derived from this world. Pilate repeatedly exposes the conflict over truth and kingship before yielding Jesus to crucifixion. Jesus completes his work with “It is finished,” and blood and water flow from his pierced side. The empty tomb leads Mary, the disciples, and finally Thomas from grief and doubt to testimony: “My Lord and my God.” The stated purpose is belief and life. The epilogue restores Peter beside the sea, commissions him to shepherd the flock, and ends with the beloved disciple’s testimony.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,399 words; 17.0 min reading; 21.9 min audio
- **Review:** Green boundary; Elevated load

### Day 321 — November 17 — Power from on High and the Church Born

- **Reading:** Acts 1:1–2:47
- **Included structure:** Acts Story A (The Witness in Jerusalem (The Church's Foundation)), scenes A.1–A.17
- **Daily movement:** Begins with Wait for the Spirit and moves through Acts: The Witness in Jerusalem (The Church's Foundation), ending with The Fellowship of Believers. Breaking bread; all things in common; the Lord added daily.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.17. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,682 words; 8.4 min reading; 10.9 min audio
- **Review:** Yellow boundary; Normal load

### Day 322 — November 18 — No Other Name: Witness in Jerusalem

- **Reading:** Acts 3:1–6:7
- **Included structure:** Acts Story A (The Witness in Jerusalem (The Church's Foundation)), scenes A.18–A.41
- **Daily movement:** Begins with At the Beautiful Gate and moves through Acts: The Witness in Jerusalem (The Church's Foundation), ending with The Seven Chosen. Stephen and six others appointed; the word of God spread.
- **Why it begins and ends here:** The reading begins at repository scene A.18 and ends after scene A.41. The final scene completes the repository story A. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,707 words; 13.5 min reading; 17.5 min audio
- **Review:** Green boundary; Normal load

### Day 323 — November 19 — Stephen’s Witness and the Gospel Scattered

- **Reading:** Acts 6:8–8:40
- **Included structure:** Acts Story B (The Witness in Judea and Samaria (Expansion)), scenes B.1–B.26
- **Daily movement:** Begins with Stephen Disputes and moves through Acts: The Witness in Judea and Samaria (Expansion), ending with The Eunuch Baptized. What prevents me? — Philip is carried away to Azotus.
- **Why it begins and ends here:** The reading begins at repository scene B.1 and ends after scene B.26. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,486 words; 12.4 min reading; 16.0 min audio
- **Review:** Yellow boundary; Normal load

### Day 324 — November 20 — A Chosen Vessel and the Word Multiplied

- **Reading:** Acts 9:1–9:43
- **Included structure:** Acts Story B (The Witness in Judea and Samaria (Expansion)), scenes B.27–B.37
- **Daily movement:** Begins with The Road to Damascus and moves through Acts: The Witness in Judea and Samaria (Expansion), ending with 'Tabitha, Arise'. He presented her alive; many believed in the Lord.
- **Why it begins and ends here:** The reading begins at repository scene B.27 and ends after scene B.37. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,046 words; 5.2 min reading; 6.7 min audio
- **Review:** Yellow boundary; Normal load

### Day 325 — November 21 — God Hath Granted Repentance unto the Gentiles

- **Reading:** Acts 10:1–12:25
- **Included structure:** Acts Story B (The Witness in Judea and Samaria (Expansion)), scenes B.38–B.59
- **Daily movement:** Cornelius and Peter receive coordinated visions that bring the apostle into a Gentile household. Peter learns not to call people common or unclean and declares that God shows no partiality. The Spirit falls before circumcision, compelling baptism and forcing the Jerusalem believers to recognize God’s work. Antioch becomes a new missionary center where disciples are first called Christians. Herod kills James and imprisons Peter, but an angel releases the apostle and judgment falls upon the self-exalting king. The story ends: “the word of God grew and multiplied.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,437 words; 12.2 min reading; 15.7 min audio
- **Review:** Green boundary; Normal load

### Day 326 — November 22 — A Light to the Gentiles and Salvation by Grace

- **Reading:** Acts 13:1–15:35
- **Included structure:** Acts Story C (To the Ends of the Earth: First Missionary Journey), scenes C.1–C.18; Acts Story D (The Jerusalem Council (Gospel for Gentiles Confirmed)), scenes D.1–D.8
- **Daily movement:** The Spirit sends Barnabas and Saul from Antioch. Through Cyprus and Asia Minor, Paul proclaims Israel’s history, Jesus’ resurrection, forgiveness, and justification, turning toward receptive Gentiles when opposition hardens. Churches are established through persecution and strengthened to endure tribulation. A dispute then threatens the gospel by requiring Gentile believers to receive circumcision. Peter, Paul, Barnabas, James, the prophets, and the gathered church agree that salvation rests upon the grace of the Lord Jesus, and the decision brings rejoicing rather than division.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,704 words; 13.5 min reading; 17.4 min audio
- **Review:** Green boundary; Normal load

### Day 327 — November 23 — The Macedonian Call and the Unknown God

- **Reading:** Acts 15:36–18:22
- **Included structure:** Acts Story E (Second Missionary Journey (Macedonia and Achaia)), scenes E.1–E.20
- **Daily movement:** Paul and Barnabas separate, but mission multiplies. Timothy joins Paul, the Spirit redirects the company, and a Macedonian vision opens the European mission. Lydia believes, a slave girl is delivered, and the Philippian jailer asks what he must do to be saved. In Thessalonica and Berea, hearers respond differently to Scripture. At Athens, Paul begins from the altar to the unknown God and summons hearers to repentance in light of resurrection and judgment. The movement reaches Corinth, where God promises a numerous people and the Roman tribunal refuses to criminalize the dispute.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,425 words; 12.1 min reading; 15.6 min audio
- **Review:** Green boundary; Normal load

### Day 328 — November 24 — So Mightily Grew the Word and Prevailed

- **Reading:** Acts 18:23–21:16
- **Included structure:** Acts Story F (Third Missionary Journey and the Ephesian Triumph), scenes F.1–F.25
- **Daily movement:** Apollos receives fuller instruction, and Paul’s extended Ephesian ministry confronts incomplete understanding, counterfeit spiritual power, occult practice, and an economy built around Artemis. Confessed practices are abandoned and costly scrolls burned as the word prevails. After the Ephesian riot, Paul strengthens the churches, raises Eutychus, and delivers a tearful farewell to the Ephesian elders. He warns that savage wolves will arise, entrusts the flock to God and the word of grace, and continues toward Jerusalem despite repeated warnings of suffering.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Story ending
- **KJV load:** 2,422 words; 12.1 min reading; 15.6 min audio
- **Review:** Green boundary; Normal load

### Day 329 — November 25 — Seized in the Temple and Preserved by Night

- **Reading:** Acts 21:17–23:35
- **Included structure:** Acts Story G (Arrest, Trials, Voyage, and Rome (Apostolic Climax)), scenes G.1–G.19
- **Daily movement:** Begins with Advice from James and moves through Acts: Arrest, Trials, Voyage, and Rome (Apostolic Climax), ending with Before Felix. Kept under guard in Herod's praetorium.
- **Why it begins and ends here:** The reading begins at repository scene G.1 and ends after scene G.19. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,353 words; 11.8 min reading; 15.2 min audio
- **Review:** Yellow boundary; Normal load

### Day 330 — November 26 — A Witness before Governors and Kings

- **Reading:** Acts 24:1–26:32
- **Included structure:** Acts Story G (Arrest, Trials, Voyage, and Rome (Apostolic Climax)), scenes G.20–G.39
- **Daily movement:** Begins with Tertullus's Flattery and moves through Acts: Arrest, Trials, Voyage, and Rome (Apostolic Climax), ending with Innocent. He could have been freed had he not appealed to Caesar.
- **Why it begins and ends here:** The reading begins at repository scene G.20 and ends after scene G.39. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 2,132 words; 10.7 min reading; 13.8 min audio
- **Review:** Yellow boundary; Normal load

### Day 331 — November 27 — Through the Storm to Rome—Unhindered

- **Reading:** Acts 27:1–28:31
- **Included structure:** Acts Story G (Arrest, Trials, Voyage, and Rome (Apostolic Climax)), scenes G.40–G.55
- **Daily movement:** The voyage to Rome becomes a final enacted testimony. Human expertise ignores Paul’s warning, the storm removes every ordinary hope, and God promises that all aboard will survive. Paul becomes the ship’s calmest and most credible voice, and every passenger reaches land. On Malta, a viper cannot stop him and healing continues. Paul finally enters Rome, explains the hope of Israel, reasons from Moses and the Prophets, and proclaims the kingdom of God and Jesus Christ. Acts ends without narrating Paul’s verdict because the true climax is the word advancing in the imperial capital “with all confidence, no man forbidding him.”
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 1,851 words; 9.3 min reading; 11.9 min audio
- **Review:** Green boundary; Normal load

### Day 332 — November 28 — The Gospel Thesis and the Whole World Guilty

- **Reading:** Romans 1:1–3:20
- **Included structure:** Romans Story A (Prologue and Thesis), scenes A.1–A.4; Romans Story B (The Universal Need for Righteousness), scenes B.1–B.14
- **Daily movement:** Begins with Called as Apostle for the Gospel of God and moves through Romans: Prologue and Thesis; Romans: The Universal Need for Righteousness, ending with Every Mouth Stopped by the Law's Verdict. The law speaks to silence every mouth; the whole world becomes accountable to God; no one will be justified before Him by works of the law.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene B.14. The final scene completes the repository story B. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,669 words; 8.3 min reading; 10.8 min audio
- **Review:** Green boundary; Normal load

### Day 333 — November 29 — The Righteousness of God Revealed by Faith

- **Reading:** Romans 3:21–5:21
- **Included structure:** Romans Story C (Justification by Faith (The Core Doctrine)), scenes C.1–C.12
- **Daily movement:** Begins with Essence of Justification and moves through Romans: Justification by Faith (The Core Doctrine), ending with Final Contrast and Grace’s Reign. As–so summary; law enters to increase trespass; grace reigns to life. Devices: parallelism, climactic summary.
- **Why it begins and ends here:** The reading begins at repository scene C.1 and ends after scene C.12. The final scene completes the repository story C. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,237 words; 6.2 min reading; 8.0 min audio
- **Review:** Green boundary; Normal load

### Day 334 — November 30 — No Condemnation: Alive to God in the Spirit

- **Reading:** Romans 6:1–8:39
- **Included structure:** Romans Story D (Sanctification and Life in the Spirit), scenes D.1–D.20
- **Daily movement:** Begins with Death to Sin Through Baptism and moves through Romans: Sanctification and Life in the Spirit, ending with Nothing Can Separate Us from the Love of Christ. Who shall separate us from Christ's love? Tribulation, distress, sword? In all these we are more than conquerors through Him. Nothing in all creation can separate us from the love of God.
- **Why it begins and ends here:** The reading begins at repository scene D.1 and ends after scene D.20. The final scene completes the repository story D. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,992 words; 10.0 min reading; 12.9 min audio
- **Review:** Green boundary; Normal load

### Day 335 — December 1 — Mercy upon All and the Depth of God’s Wisdom

- **Reading:** Romans 9:1–11:36
- **Included structure:** Romans Story E (God’s Plan for Israel (The Parenthesis)), scenes E.1–E.20
- **Daily movement:** Begins with Paul’s Sorrow and Israel’s Privileges and moves through Romans: God’s Plan for Israel (The Parenthesis), ending with Doxology. Depth of wisdom; from, through, to him are all things. Devices: hymnic doxology, rhetorical seal.
- **Why it begins and ends here:** The reading begins at repository scene E.1 and ends after scene E.20. The final scene completes the repository story E. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,998 words; 10.0 min reading; 12.9 min audio
- **Review:** Green boundary; Normal load

### Day 336 — December 2 — A Living Sacrifice and the Obedience of Faith

- **Reading:** Romans 12:1–16:27
- **Included structure:** Romans Story F (Practical Righteousness and Christian Duty), scenes F.1–F.18; Romans Story G (Conclusion, Travel Plans, and Doxology), scenes G.1–G.12
- **Daily movement:** “Therefore” turns the theological argument into embodied worship. Believers offer themselves as living sacrifices, receive renewed minds, practice humble gifts, love without hypocrisy, bless persecutors, overcome evil with good, and fulfill the Law through love. Duties toward governing authorities are followed by the call to awaken and put on Christ. Disputes over food and days must be governed by conscience, faith, love, and welcome rather than contempt. Paul’s travel plans and extensive greetings reveal doctrine taking social form in a network of named coworkers. The letter closes where it began: the gospel advances among all nations for the obedience of faith.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,526 words; 12.6 min reading; 16.3 min audio
- **Review:** Green boundary; Normal load

### Day 337 — December 3 — Christ Crucified and a Holy Temple

- **Reading:** 1 Corinthians 1:1–6:20
- **Included structure:** 1 Corinthians Story A (Opening and Response to Reported Divisions), scenes A.1–A.28
- **Daily movement:** Begins with Called as Apostle; Grace and Peace and moves through 1 Corinthians: Opening and Response to Reported Divisions, ending with Flee Immorality; Glorify God With Your Body. Flee sexual immorality — every other sin is outside the body, but the sexually immoral sins against his own body; your body is the temple of the Holy Spirit; you are not your own, you were bought at a price — glorify God with your body.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.28. The final scene completes the repository story A. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,776 words; 13.9 min reading; 17.9 min audio
- **Review:** Green boundary; Normal load

### Day 338 — December 4 — The Freedom That Serves

- **Reading:** 1 Corinthians 7:1–11:1
- **Included structure:** 1 Corinthians Story B (Response to the Letter: Marriage, Food, and Apostolic Freedom), scenes B.1–B.27
- **Daily movement:** Begins with Mutual Marital Duty and moves through 1 Corinthians: Response to the Letter: Marriage, Food, and Apostolic Freedom, ending with Do All to God's Glory; Imitate Me. Whether you eat or drink or whatever you do, do it all to the glory of God; do not become a stumbling block to Jews, Greeks, or the church; try to please everyone, not seeking your own good but the good of many that they may be saved — imitate me as I imitate Christ.
- **Why it begins and ends here:** The reading begins at repository scene B.1 and ends after scene B.27. The final scene completes the repository story B. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,618 words; 13.1 min reading; 16.9 min audio
- **Review:** Green boundary; Normal load

### Day 339 — December 5 — One Body and the More Excellent Way

- **Reading:** 1 Corinthians 11:2–14:40
- **Included structure:** 1 Corinthians Story C (Liturgical Order: Worship, the Supper, and Spiritual Gifts), scenes C.1–C.27
- **Daily movement:** Begins with Head Coverings: Christ, Man, and Woman and moves through 1 Corinthians: Liturgical Order: Worship, the Supper, and Spiritual Gifts, ending with Eager to Prophesy; All in Proper Order. So, my brothers, be eager to prophesy and do not forbid speaking in tongues; but everything must be done in a proper and orderly manner.
- **Why it begins and ends here:** The reading begins at repository scene C.1 and ends after scene C.27. The final scene completes the repository story C. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,456 words; 12.3 min reading; 15.8 min audio
- **Review:** Green boundary; Normal load

### Day 340 — December 6 — Resurrection, Steadfast Labor, and Love

- **Reading:** 1 Corinthians 15:1–16:24
- **Included structure:** 1 Corinthians Story D (The Doctrine of the Resurrection), scenes D.1–D.14; 1 Corinthians Story E (Final Instructions and Farewell), scenes E.1–E.5
- **Daily movement:** Begins with The Gospel: Christ Died and Was Raised and moves through 1 Corinthians: The Doctrine of the Resurrection; 1 Corinthians: Final Instructions and Farewell, ending with Greetings, the Holy Kiss, and the Final Amen. The churches of Asia greet you; Aquila and Prisca greet warmly, and the church in their house; all the brothers greet you — greet one another with a holy kiss; this greeting is in Paul's own hand; if anyone does not love the Lord, let him be cursed — come, O Lord! The grace of the Lord Jesus be with you; Paul's love with all of you in Christ Jesus. Amen.
- **Why it begins and ends here:** The reading begins at repository scene D.1 and ends after scene E.5. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 1,612 words; 8.1 min reading; 10.4 min audio
- **Review:** Green boundary; Normal load

### Day 341 — December 7 — The God of All Comfort and Ministers of the New Covenant

- **Reading:** 2 Corinthians 1:1–3:6
- **Included structure:** 2 Corinthians Story A (Reconciliation and the Ministry of the New Covenant), scenes A.1–A.11
- **Daily movement:** Begins with Salutation and moves through 2 Corinthians: Reconciliation and the Ministry of the New Covenant, ending with Letter and Spirit; Sufficiency from God. Corinthians as letter; ministers of new covenant—letter kills, Spirit gives life. Devices: commendation question, letter/Spirit contrast.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.11. The endpoint is a strong completed scene or internal movement; the next day begins with a new repository scene. No scene is divided.
- **Endpoint:** Major movement
- **KJV load:** 1,126 words; 5.6 min reading; 7.3 min audio
- **Review:** Yellow boundary; Normal load

### Day 342 — December 8 — Unveiled Glory and the Ministry of Reconciliation

- **Reading:** 2 Corinthians 3:7–7:16
- **Included structure:** 2 Corinthians Story A (Reconciliation and the Ministry of the New Covenant), scenes A.12–A.32
- **Daily movement:** Begins with The Greater Glory of the New Ministry and moves through 2 Corinthians: Reconciliation and the Ministry of the New Covenant, ending with Boasting of You Proved True. Paul's boasting to Titus was vindicated, and his complete confidence in them restored.
- **Why it begins and ends here:** The reading begins at repository scene A.12 and ends after scene A.32. The final scene completes the repository story A. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,957 words; 9.8 min reading; 12.6 min audio
- **Review:** Green boundary; Normal load

### Day 343 — December 9 — The Grace of Giving and Power in Weakness

- **Reading:** 2 Corinthians 8:1–13:14
- **Included structure:** 2 Corinthians Story B (The Collection for the Jerusalem Saints), scenes B.1–B.9; 2 Corinthians Story C (Paul’s Defense of His Apostolic Authority), scenes C.1–C.23
- **Daily movement:** Paul presents the Macedonians' generosity and Christ's self-giving poverty as models for completing the Jerusalem collection. Giving is described as grace, equality, willing service, sowing, and thanksgiving. At 10:1 the tone changes sharply as Paul confronts rival apostles and defends the divine authority of a ministry that appears outwardly weak. His reluctant boasting becomes a catalog of suffering, dependence, visions, and the thorn in the flesh. The movement reaches its theological center in Christ's declaration that divine power is perfected in weakness. Paul closes by preparing for his third visit and blessing the church with grace, love, and fellowship.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 2,982 words; 14.9 min reading; 19.2 min audio
- **Review:** Green boundary; Normal load

### Day 344 — December 10 — No Other Gospel: Faith Working through Love

- **Reading:** Galatians 1:1–6:18
- **Included structure:** Galatians Story A (Paul’s Apostolic Defense and Confrontation), scenes A.1–A.10; Galatians Story B (The Theological Proof of Justification by Faith), scenes B.1–B.15; Galatians Story C (Freedom and Ethical Life in the Spirit), scenes C.1–C.8; Galatians Story D (The Final Signature and Exhortation), scenes D.1–D.2
- **Daily movement:** Paul opens without his customary thanksgiving and immediately confronts the Galatians' desertion to a distorted gospel. He defends the divine origin of his commission, recounts his confrontation with Peter, and declares that righteousness cannot come through the law. Abraham, the promise, the law as guardian, adoption, and the two women allegory establish the theological case. Paul then turns from argument to exhortation: freedom must express itself through loving service, walking by the Spirit rather than gratifying the flesh. Burden-bearing, sowing and reaping, and doing good lead into Paul's handwritten conclusion: neither circumcision nor uncircumcision counts, but a new creation.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,084 words; 15.4 min reading; 19.9 min audio
- **Review:** Green boundary; Elevated load

### Day 345 — December 11 — Raised Together: One Body and One Worthy Walk

- **Reading:** Ephesians 1:1–6:24
- **Included structure:** Ephesians Story A (The Eternal Plan: Union, Riches, and Resurrection Power), scenes A.1–A.12; Ephesians Story B (The Revelation of the Mystery and the Body’s Unity), scenes B.1–B.8; Ephesians Story C (The New Walk in the World and Spiritual Warfare), scenes C.1–C.20
- **Daily movement:** Paul begins with the sweeping blessings believers possess in Christ: election, adoption, redemption, forgiveness, inheritance, and the sealing Spirit. Those once dead in sin are raised by grace, and Jews and Gentiles are reconciled into one new humanity and one dwelling place for God. Paul then reveals the mystery of this united body and prays that the church will comprehend the immeasurable love of Christ. The second half turns from identity to conduct: walk worthily, preserve unity, put off the old humanity, walk in love and light, order the household under Christ, and stand against spiritual evil in the whole armor of God.
- **Why it begins and ends here:** This reading preserves the stated repository movement and ends at the listed structural endpoint.
- **Endpoint:** Book ending
- **KJV load:** 3,022 words; 15.1 min reading; 19.5 min audio
- **Review:** Green boundary; Elevated load

### Day 346 — December 12 — The Mind of Christ and the Joy of Knowing Him

- **Reading:** Philippians 1:1–4:23
- **Included structure:** Philippians Story A (The Foundation of Joy: Salutation and the Example of Suffering), scenes A.1–A.8; Philippians Story B (Christ’s Humiliation and Ministers Who Embody It), scenes B.1–B.7; Philippians Story C (The Pursuit of Christ and Heavenly Citizenship), scenes C.1–C.4; Philippians Story D (Specific Exhortations, Gratitude, and Benediction), scenes D.1–D.5
- **Daily movement:** Begins with Salutation and moves through Philippians: The Foundation of Joy: Salutation and the Example of Suffering; Philippians: Christ’s Humiliation and Ministers Who Embody It; Philippians: The Pursuit of Christ and Heavenly Citizenship; Philippians: Specific Exhortations, Gratitude, and Benediction, ending with Final Greetings and Grace. Greetings from the saints, especially Caesar's household, and the closing grace.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene D.5. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 2,183 words; 10.9 min reading; 14.1 min audio
- **Review:** Green boundary; Normal load

### Day 347 — December 13 — The Fullness of Christ and the New Humanity

- **Reading:** Colossians 1:1–4:18
- **Included structure:** Colossians Story A (Christ, the Head: Introduction, Prayer, and Supremacy), scenes A.1–A.7; Colossians Story B (The Fullness of Christ Against the False Philosophy), scenes B.1–B.4; Colossians Story C (Life in the New Realm: Ethical Commands), scenes C.1–C.7; Colossians Story D (Final Greetings, News, and Charge), scenes D.1–D.4
- **Daily movement:** Begins with Salutation and moves through Colossians: Christ, the Head: Introduction, Prayer, and Supremacy; Colossians: The Fullness of Christ Against the False Philosophy; Colossians: Life in the New Realm: Ethical Commands; Colossians: Final Greetings, News, and Charge, ending with Autograph and Benediction. ‘I, Paul, write… Remember my chains. Grace be with you.’ Devices: autograph verification, pathos appeal, grace close.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene D.4. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 1,979 words; 9.9 min reading; 12.8 min audio
- **Review:** Green boundary; Normal load

### Day 348 — December 14 — Comfort One Another with the Coming of the Lord

- **Reading:** 1 Thessalonians 1:1–5:28
- **Included structure:** 1 Thessalonians Story A (The Apostolic Relationship and Foundational Narrative), scenes A.1–A.9; 1 Thessalonians Story B (Instructions for Holy Living and the Day of the Lord), scenes B.1–B.9; 1 Thessalonians Story C (Final Prayer and Benediction), scenes C.1–C.2
- **Daily movement:** Begins with Salutation and God’s Electing Power and moves through 1 Thessalonians: The Apostolic Relationship and Foundational Narrative; 1 Thessalonians: Instructions for Holy Living and the Day of the Lord; 1 Thessalonians: Final Prayer and Benediction, ending with Final Greetings and Signature. Pray for us; holy kiss; read to all; grace be with you. Devices: brief imperatives, communal greeting, grace formula close.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene C.2. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 1,837 words; 9.2 min reading; 11.9 min audio
- **Review:** Green boundary; Normal load

### Day 349 — December 15 — Stand Fast until the Lord Comes

- **Reading:** 2 Thessalonians 1:1–3:18
- **Included structure:** 2 Thessalonians Story A (Opening, Praise, and Prayer), scenes A.1–A.3; 2 Thessalonians Story B (The Lord’s Coming and the Man of Lawlessness), scenes B.1–B.4; 2 Thessalonians Story C (Final Exhortation and Benediction), scenes C.1–C.4
- **Daily movement:** Begins with Salutation and Thanksgiving for Faith and moves through 2 Thessalonians: Opening, Praise, and Prayer; 2 Thessalonians: The Lord’s Coming and the Man of Lawlessness; 2 Thessalonians: Final Exhortation and Benediction, ending with Final Encouragement, Authentication, and Blessing. Do not grow weary in well-doing; the Lord of peace, Paul's own-hand mark, and the grace.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene C.4. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 1,022 words; 5.1 min reading; 6.6 min audio
- **Review:** Green boundary; Normal load

### Day 350 — December 16 — Fight the Good Fight and Guard the Deposit

- **Reading:** 1 Timothy 1:1–6:21
- **Included structure:** 1 Timothy Story A (Initial Charge: The Purpose of the Law and Warning Against False Teaching), scenes A.1–A.5; 1 Timothy Story B (Corporate Worship and Church Leadership), scenes B.1–B.8; 1 Timothy Story C (Instructions for Godly Living and Confronting Error), scenes C.1–C.9; 1 Timothy Story D (Final Admonitions, Danger of Wealth, and Closing Charge), scenes D.1–D.5
- **Daily movement:** Begins with Salutation and The Immediate Commission and moves through 1 Timothy: Initial Charge: The Purpose of the Law and Warning Against False Teaching; 1 Timothy: Corporate Worship and Church Leadership; 1 Timothy: Instructions for Godly Living and Confronting Error; 1 Timothy: Final Admonitions, Danger of Wealth, and Closing Charge, ending with Final Summary and Farewell. Guard the deposit; avoid profane chatter/contradictions; grace be with you. Devices: deposit metaphor (parathēkē), inclusio with opening charge, benediction formula.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene D.5. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 2,244 words; 11.2 min reading; 14.5 min audio
- **Review:** Green boundary; Normal load

### Day 351 — December 17 — Preach the Word and Finish the Course

- **Reading:** 2 Timothy 1:1–4:22
- **Included structure:** 2 Timothy Story A (Paul’s Foundational Encouragement and the Example of Loyalty), scenes A.1–A.4; 2 Timothy Story B (The Disciplines of a Faithful Minister), scenes B.1–B.6; 2 Timothy Story C (Prophecy of Peril and the Authority of Scripture), scenes C.1–C.6; 2 Timothy Story D (Personal Postscript, Farewell, and Benediction), scenes D.1–D.4
- **Daily movement:** Begins with Salutation and Sincere Remembrance and moves through 2 Timothy: Paul’s Foundational Encouragement and the Example of Loyalty; 2 Timothy: The Disciplines of a Faithful Minister; 2 Timothy: Prophecy of Peril and the Authority of Scripture; 2 Timothy: Personal Postscript, Farewell, and Benediction, ending with Final Greetings and Grace. Greet Prisca/Aquila and others; travel notes; ‘The Lord be with your spirit. Grace be with you.’ Devices: epistolary greeting list, double benediction close.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene D.4. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 1,666 words; 8.3 min reading; 10.7 min audio
- **Review:** Green boundary; Normal load

### Day 352 — December 18 — Sound Doctrine, Good Works, and a Brother Received

- **Reading:** Titus 1:1–3:15; Philemon 1–25
- **Included structure:** Titus Story A (The Commission and the Conflict in Crete), scenes A.1–A.4; Titus Story B (The Pattern of Sound Doctrine and Good Works), scenes B.1–B.8; Titus Story C (Final Logistics and Farewell), scenes C.1; Philemon Story A (Paul’s Masterful Appeal for Onesimus’s Reconciliation), scenes A.1–A.7
- **Daily movement:** Begins with Salutation and Theological Foundation and moves through Titus: The Commission and the Conflict in Crete; Titus: The Pattern of Sound Doctrine and Good Works; Titus: Final Logistics and Farewell; Philemon: Paul’s Masterful Appeal for Onesimus’s Reconciliation, ending with Confidence, a Guest Room, and Farewell. Confidence of obedience, the lodging hint, greetings from his fellow workers, and the grace-blessing.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.7. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book endings
- **KJV load:** 1,326 words; 6.6 min reading; 8.6 min audio
- **Review:** Green boundary; Normal load

### Day 353 — December 19 — The Son, the Rest, and the Priest Forever

- **Reading:** Hebrews 1:1–7:28
- **Included structure:** Hebrews Story A (The Son’s Superiority to Prophets and Angels), scenes A.1–A.10; Hebrews Story B (Christ’s Superiority to Moses and the Call to Enter Rest), scenes B.1–B.10; Hebrews Story C (The Superior Priesthood of Melchizedek), scenes C.1–C.18
- **Daily movement:** Begins with The Son’s Final and Full Revelation and moves through Hebrews: The Son’s Superiority to Prophets and Angels; Hebrews: Christ’s Superiority to Moses and the Call to Enter Rest; Hebrews: The Superior Priesthood of Melchizedek, ending with Holy, Innocent, Once for All. The fitting high priest who offered Himself, the Son made perfect forever.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene C.18. The final scene completes the repository story C. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,929 words; 14.6 min reading; 18.9 min audio
- **Review:** Green boundary; Normal load

### Day 354 — December 20 — A Better Covenant and One Sacrifice for Sins

- **Reading:** Hebrews 8:1–10:39
- **Included structure:** Hebrews Story D (Superiority of Covenant and Sanctuary), scenes D.1–D.22
- **Daily movement:** Begins with Heavenly Ministry and Better Covenant and moves through Hebrews: Superiority of Covenant and Sanctuary, ending with My Righteous One Will Live by Faith. The coming One, and the faith that preserves the soul against shrinking back.
- **Why it begins and ends here:** The reading begins at repository scene D.1 and ends after scene D.22. The final scene completes the repository story D. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,849 words; 9.2 min reading; 11.9 min audio
- **Review:** Green boundary; Normal load

### Day 355 — December 21 — Faith, Endurance, and the City to Come

- **Reading:** Hebrews 11:1–13:25
- **Included structure:** Hebrews Story E (Faith, Ethical Living, and Final Benediction), scenes E.1–E.28
- **Daily movement:** Begins with Faith Is the Assurance and moves through Hebrews: Faith, Ethical Living, and Final Benediction, ending with Final Prayer, Greetings, and Grace. God of peace benediction; brief greetings; ‘Grace be with all of you.’ Devices: summary benediction, epistolary close.
- **Why it begins and ends here:** The reading begins at repository scene E.1 and ends after scene E.28. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 2,119 words; 10.6 min reading; 13.7 min audio
- **Review:** Green boundary; Normal load

### Day 356 — December 22 — Tested Faith That Becomes a Doer

- **Reading:** James 1:1–5:20
- **Included structure:** James Story A (Enduring Trials and the Perfect Gift), scenes A.1–A.5; James Story B (The Royal Law and the True Nature of Faith), scenes B.1–B.10; James Story C (The Control of Speech and the Two Wisdoms), scenes C.1–C.7; James Story D (Warnings, Patience, and the Power of Prayer), scenes D.1–D.6
- **Daily movement:** Begins with The Joy of Enduring the Test of Faith and moves through James: Enduring Trials and the Perfect Gift; James: The Royal Law and the True Nature of Faith; James: The Control of Speech and the Two Wisdoms; James: Warnings, Patience, and the Power of Prayer, ending with Goal: Restore the Wanderer. If anyone wanders, bring him back; cover a multitude of sins. Devices: restoration inclusio with opening themes, salvation payoff.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene D.6. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 2,304 words; 11.5 min reading; 14.9 min audio
- **Review:** Green boundary; Normal load

### Day 357 — December 23 — Living Hope and Faithfulness through Suffering

- **Reading:** 1 Peter 1:1–5:14
- **Included structure:** 1 Peter Story A (The Foundation of Living Hope), scenes A.1–A.4; 1 Peter Story B (The Call to Holiness and Purity), scenes B.1–B.6; 1 Peter Story C (Submission and Social Conduct), scenes C.1–C.7; 1 Peter Story D (Suffering, Eschatology, and Judgment), scenes D.1–D.6; 1 Peter Story E (Exhortation to Leaders and Final Farewell), scenes E.1–E.4
- **Daily movement:** Begins with Formal Salutation and Greeting and moves through 1 Peter: The Foundation of Living Hope; 1 Peter: The Call to Holiness and Purity; 1 Peter: Submission and Social Conduct; 1 Peter: Suffering, Eschatology, and Judgment; 1 Peter: Exhortation to Leaders and Final Farewell, ending with Formal Closures and Greetings. By Silvanus…; greeting from ‘she in Babylon’; kiss of love; peace to all. Devices: letter‑carrier note, cryptic location, formulaic farewell.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene E.4. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 2,476 words; 12.4 min reading; 16.0 min audio
- **Review:** Green boundary; Normal load

### Day 358 — December 24 — Remember the Apostolic Word and Contend for the Faith

- **Reading:** 2 Peter 1:1–3:18; Jude 1–25
- **Included structure:** 2 Peter Story A (The Foundation of Apostolic Knowledge and Witness), scenes A.1–A.5; 2 Peter Story B (The Judgment of False Teachers), scenes B.1–B.5; 2 Peter Story C (The Certainty of the End and Final Exhortation), scenes C.1–C.5; Jude Story A (The Call to Contend and the Doom of the Godless), scenes A.1–A.8
- **Daily movement:** Begins with Salutation and the Divine Call and moves through 2 Peter: The Foundation of Apostolic Knowledge and Witness; 2 Peter: The Judgment of False Teachers; 2 Peter: The Certainty of the End and Final Exhortation; Jude: The Call to Contend and the Doom of the Godless, ending with Concluding Doxology. To Him able to keep them from stumbling — glory, majesty, dominion, and authority forever.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.8. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book endings
- **KJV load:** 2,161 words; 10.8 min reading; 13.9 min audio
- **Review:** Green boundary; Normal load

### Day 359 — December 25 — Walk in the Light, Truth, and Love

- **Reading:** 1 John 1:1–5:21; 2 John 1–13; 3 John 1–14
- **Included structure:** 1 John Story A (The Reality of Fellowship: Light, Obedience, and Antichrist), scenes A.1–A.8; 1 John Story B (The Imperative of Righteousness: The Children of God vs. The World), scenes B.1–B.5; 1 John Story C (The Completion of Love: The Two Commands and Eternal Life), scenes C.1–C.8; 2 John Story A (The Great Commandment: Walking in Truth and Love), scenes A.1–A.4; 3 John Story A (The Elder’s Appeal for Truth and Hospitality), scenes A.1–A.4
- **Daily movement:** Begins with Prologue: Witnessing the Word of Life and moves through 1 John: The Reality of Fellowship: Light, Obedience, and Antichrist; 1 John: The Imperative of Righteousness: The Children of God vs. The World; 1 John: The Completion of Love: The Two Commands and Eternal Life; 2 John: The Great Commandment: Walking in Truth and Love; 3 John: The Elder’s Appeal for Truth and Hospitality, ending with Demetrius Commended and Final Farewell. Demetrius has good testimony from all and the truth itself; hope to speak face‑to‑face; peace and greetings. Devices: witness commendation, personal presence preference, formulaic closing with ‘friends.’
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.4. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book endings
- **KJV load:** 3,109 words; 15.5 min reading; 20.1 min audio
- **Review:** Green boundary; Elevated load
- **Audit note:** KJV display reference is 3 John 1–14; the translation-agnostic master must retain a versification mapping for editions that number the farewell as verse 15.

### Day 360 — December 26 — The Son of Man among the Seven Candlesticks

- **Reading:** Revelation 1:1–3:22
- **Included structure:** Revelation Story A (The Mandate and the Seven Candlesticks), scenes A.1–A.18
- **Daily movement:** Begins with Title, Purpose, and Blessing and moves through Revelation: The Mandate and the Seven Candlesticks, ending with Laodicea: I Stand at the Door; Sit With Me on My Throne. I stand at the door and knock; if anyone hears and opens, I will come in and dine with him; to the overcomer I will grant the right to sit with Me on My throne, as I overcame and sat with My Father; hear what the Spirit says.
- **Why it begins and ends here:** The reading begins at repository scene A.1 and ends after scene A.18. The final scene completes the repository story A. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,052 words; 10.3 min reading; 13.2 min audio
- **Review:** Green boundary; Normal load

### Day 361 — December 27 — The Throne, the Lamb, and the Seven Seals

- **Reading:** Revelation 4:1–8:1
- **Included structure:** Revelation Story B (The Throne Room and the Seven Seals), scenes B.1–B.18
- **Daily movement:** Begins with A Throne in Heaven: Jasper, Carnelian, Emerald Rainbow and moves through Revelation: The Throne Room and the Seven Seals, ending with Seventh Seal — Silence. Opened; half‑hour silence in heaven. Devices: dramatic pause, septet closure.
- **Why it begins and ends here:** The reading begins at repository scene B.1 and ends after scene B.18. The final scene completes the repository story B. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,834 words; 9.2 min reading; 11.8 min audio
- **Review:** Green boundary; Normal load

### Day 362 — December 28 — The Seven Trumpets and the Kingdom Proclaimed

- **Reading:** Revelation 8:2–11:19
- **Included structure:** Revelation Story C (The Seven Trumpets and Temple Interludes), scenes C.1–C.17
- **Daily movement:** Begins with Incense and Trumpet Commission and moves through Revelation: The Seven Trumpets and Temple Interludes, ending with Seventh Trumpet — Kingdom Proclaimed. ‘The kingdom… has become the Lord’s and his Christ’; worship; temple opened and ark seen. Devices: royal proclamation, doxology, covenant‑ark epiphany.
- **Why it begins and ends here:** The reading begins at repository scene C.1 and ends after scene C.17. The final scene completes the repository story C. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,902 words; 9.5 min reading; 12.3 min audio
- **Review:** Green boundary; Normal load

### Day 363 — December 29 — The Dragon, the Beasts, and the Three Angels

- **Reading:** Revelation 12:1–14:20
- **Included structure:** Revelation Story D (The Woman, the Dragon, and the Beasts), scenes D.1–D.15
- **Daily movement:** Begins with Woman, Child, and Dragon and moves through Revelation: The Woman, the Dragon, and the Beasts, ending with Grapes of Wrath: the Great Winepress. Another angel with a sharp sickle; an angel from the altar cried to him: 'Gather the clusters from the vine of the earth, for its grapes are ripe'; he gathered and threw them into the great winepress of God's wrath; blood flowed as high as horses' bridles for 1,600 stadia outside the city.
- **Why it begins and ends here:** The reading begins at repository scene D.1 and ends after scene D.15. The final scene completes the repository story D. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 1,686 words; 8.4 min reading; 10.9 min audio
- **Review:** Green boundary; Normal load

### Day 364 — December 30 — It Is Done: The Bowls and Babylon’s Fall

- **Reading:** Revelation 15:1–19:10
- **Included structure:** Revelation Story E (The Seven Bowls of Wrath), scenes E.1–E.7; Revelation Story F (Babylon the Great Judged and the Wedding Announced), scenes F.1–F.16
- **Daily movement:** Begins with Sea of Glass Mixed With Fire: the Song of Moses and the Lamb and moves through Revelation: The Seven Bowls of Wrath; Revelation: Babylon the Great Judged and the Wedding Announced, ending with The Marriage of the Lamb; Worship God Alone. 'Let us rejoice, for the marriage of the Lamb has come, and His bride has made herself ready — fine linen is the righteous acts of the saints'; blessed are those invited to the marriage supper; John fell to worship the angel, who said: 'Do not do that — I am a fellow servant; worship God, for the testimony of Jesus is the spirit of prophecy.'
- **Why it begins and ends here:** The reading begins at repository scene E.1 and ends after scene F.16. The final scene completes the repository story F. No scene is divided.
- **Endpoint:** Story ending
- **KJV load:** 2,372 words; 11.9 min reading; 15.3 min audio
- **Review:** Green boundary; Normal load

### Day 365 — December 31 — The King Comes and All Things Are Made New

- **Reading:** Revelation 19:11–22:21
- **Included structure:** Revelation Story G (Final Victory and the Last Judgment), scenes G.1–G.5; Revelation Story H (New Creation and Epilogue), scenes H.1–H.14
- **Daily movement:** Begins with The Rider on the White Horse and moves through Revelation: Final Victory and the Last Judgment; Revelation: New Creation and Epilogue, ending with Yes, I Am Coming Soon. Amen. Come, Lord Jesus!. He who testifies to these things says: 'Yes, I am coming soon'; Amen. Come, Lord Jesus! The grace of the Lord Jesus be with all the saints. Amen.
- **Why it begins and ends here:** The reading begins at repository scene G.1 and ends after scene H.14. The final boundary is a complete book ending. No scene is divided.
- **Endpoint:** Book ending
- **KJV load:** 2,149 words; 10.7 min reading; 13.9 min audio
- **Review:** Green boundary; Normal load

## Validation report

- Exactly 365 records are present and numbered consecutively.
- Day/date mapping uses a non-leap perennial calendar from January 1 through December 31.
- The 30 Old Testament merges are non-overlapping and preserve all former passages.
- The New Testament contains 83 records and begins on Day 283.
- Every New Testament boundary is aligned to a repository scene boundary.
- No provisional Hebrew or Greek word candidate is embedded in the core calendar.
- KJV display references use 3 John 1–14; neutral versification mapping remains an overlay responsibility.
- Textual-history notes for Mark 16:9–20 and John 7:53–8:11 remain edition overlays, not structural red flags.

## Architectural verdict

This v0.2 calendar answers the first pass’s principal defect without sacrificing its governing purpose. The New Testament is no longer treated as a five-and-a-half-week sprint, Hebrews is no longer a 44-minute outlier, the short epistles are no longer crammed into four- and five-book days, and Revelation’s major cycles are allowed to land. The cost is deliberate: thirty light Old Testament calendar pauses become internal orientation pauses inside larger—but still manageable—daily movements.
