

## Fix 5 Remaining Psalm Superscription Edge Cases

The initial regex fix handled period-separated headings, but 5 rows use commas, semicolons, or quoted strings. Each needs a targeted UPDATE.

### Affected Rows

| Chapter | Version | Current Start | Should Start With |
|---------|---------|--------------|-------------------|
| 18 | KJV | "To the chief Musician, [A Psalm] of David..." | "I will love thee, O LORD, my strength." |
| 22 | WEB | "For the Chief Musician; set to..." | "My God, my God, why have you forsaken me?" |
| 22 | BSB | "To the tune of..." | "My God, my God, why have You forsaken me?" |
| 22 | MSV | "To the tune of..." | "My God, my God, why have You forsaken me?" |
| 54 | KJV | "To the chief Musician on Neginoth..." | "Save me, O God, by thy name..." |
| 75 | BSB | "For the choirmaster: To the tune..." | "We give thanks to You, O God..." |
| 75 | MSV | "For the choirmaster: To the tune..." | "We give thanks to You, O God..." |
| 75 | WEB | "To the tune of..." | "We give thanks to you, God..." |

Wait — that's 8 rows, but the query returned 5. Let me re-check: BSB Psalm 22 starts with "To the tune..." which should match. Let me just fix all matching rows.

### Implementation

Run targeted UPDATEs via the insert tool for each case:

1. **Psalm 18 KJV**: Strip everything before "I will love" — the heading ends at "...hand of Saul: And he said,"
2. **Psalm 22 WEB**: Strip before "My God, my God"
3. **Psalm 22 BSB/MSV**: Strip before "My God, my God"
4. **Psalm 54 KJV**: Strip before "Save me, O God"
5. **Psalm 75 BSB/MSV/WEB**: Strip before "We give thanks"

Each UPDATE will set both `text` and regenerate `abbreviated_text`.

### Approach
Use specific `text LIKE` patterns to target each row precisely, avoiding collateral damage. Then verify all 150 Psalm verse 1s are clean.

