# Pericope Format Analysis

## Summary

- **Total files:** 1063
- **Hosea format (correct):** 93
- **Ezekiel format (needs conversion):** 446
- **Markdown format (needs conversion):** 432
- **Other format:** 92

## Format Types

### Hosea Format (TARGET) ✅
```typescript
{
  id: 1,
  verses: [1, 2, 3, 4, 5],
  name: 'Pericope Name'
}
```

Books using this format (93):
acts1.ts, acts10.ts, acts11.ts, acts12.ts, acts13.ts, acts14.ts, acts15.ts, acts16.ts, acts17.ts, acts18.ts, acts19.ts, acts2.ts, acts20.ts, acts21.ts, acts22.ts, acts23.ts, acts24.ts, acts25.ts, acts26.ts, acts27.ts...

### Ezekiel Format (NEEDS CONVERSION) ⚠️
```typescript
{
  id: 'ezekiel1-1',
  ref: 'Subtitle · v1-5',
  name: 'Pericope Name',
  verses: [] // empty
}
```

Books using this format (446):
1corinthians1.ts, 1corinthians10.ts, 1corinthians11.ts, 1corinthians12.ts, 1corinthians13.ts, 1corinthians14.ts, 1corinthians15.ts, 1corinthians16.ts, 1corinthians2.ts, 1corinthians3.ts, 1corinthians4.ts, 1corinthians5.ts, 1corinthians6.ts, 1corinthians7.ts, 1corinthians8.ts, 1corinthians9.ts, 1john1.ts, 1john2.ts, 1john3.ts, 1john4.ts...

### Markdown Format (NEEDS CONVERSION) ⚠️
```typescript
{
  ref: 'v1-5',
  name: 'Pericope Name',
  lore: 'Description...',
  theme: 'Theme',
  verseCount: 5
}
```

Books using this format (432):
1chronicles1.ts, 1chronicles11.ts, 1chronicles12.ts, 1chronicles13.ts, 1chronicles14.ts, 1chronicles15.ts, 1chronicles16.ts, 1chronicles17.ts, 1chronicles18.ts, 1chronicles19.ts, 1chronicles2.ts, 1chronicles20.ts, 1chronicles21.ts, 1chronicles22.ts, 1chronicles23.ts, 1chronicles24.ts, 1chronicles25.ts, 1chronicles26.ts, 1chronicles27.ts, 1chronicles28.ts...

### Other Format
Books using other formats (92):
joel1.ts, joel2.ts, joel3.ts, john1.ts, john10.ts, john11.ts, john12.ts, john13.ts, john14.ts, john15.ts, john16.ts, john17.ts, john18.ts, john19.ts, john2.ts, john20.ts, john21.ts, john3.ts, john4.ts, john5.ts, john6.ts, john7.ts, john8.ts, john9.ts, luke1.ts, luke10.ts, luke11.ts, luke12.ts, luke13.ts, luke14.ts, luke15.ts, luke16.ts, luke17.ts, luke18.ts, luke19.ts, luke2.ts, luke20.ts, luke21.ts, luke22.ts, luke23.ts, luke24.ts, luke3.ts, luke4.ts, luke5.ts, luke6.ts, luke7.ts, luke8.ts, luke9.ts, mark1.ts, mark10.ts, mark11.ts, mark12.ts, mark13.ts, mark14.ts, mark15.ts, mark16.ts, mark2.ts, mark3.ts, mark4.ts, mark5.ts, mark6.ts, mark7.ts, mark8.ts, mark9.ts, matthew1.ts, matthew10.ts, matthew11.ts, matthew12.ts, matthew13.ts, matthew14.ts, matthew15.ts, matthew16.ts, matthew17.ts, matthew18.ts, matthew19.ts, matthew2.ts, matthew20.ts, matthew21.ts, matthew22.ts, matthew23.ts, matthew24.ts, matthew25.ts, matthew26.ts, matthew27.ts, matthew28.ts, matthew3.ts, matthew4.ts, matthew5.ts, matthew6.ts, matthew7.ts, matthew8.ts, matthew9.ts
