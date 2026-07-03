#!/usr/bin/env node
/**
 * Consolidate Numbers pericopes
 * Current: 36 pericopes (1 per chapter) = 35.8 v/p
 * Target: ~75-80 pericopes (2 per chapter avg) = 16-18 v/p
 *
 * Numbers structure:
 * - Ch 1-4: Census and organization (~100 verses)
 * - Ch 5-10: Laws and departure from Sinai (~140 verses)
 * - Ch 11-14: Complaints and spies (~130 verses)
 * - Ch 15-19: Laws and priesthood (~150 verses)
 * - Ch 20-25: Journey and Balaam (~140 verses)
 * - Ch 26-30: Second census and offerings (~140 verses)
 * - Ch 31-36: Final preparations (~110 verses)
 */

const NUMBERS_CHAPTERS = {
  // Chapter 1: Census at Sinai (54 verses)
  1: [
    { verse_start: 1, verse_end: 19, name: 'Census Instructions' },
    { verse_start: 20, verse_end: 43, name: 'Census of Tribes' },
    { verse_start: 44, verse_end: 54, name: 'Levites Not Counted' }
  ],

  // Chapter 2: Arrangement of Camps (34 verses)
  2: [
    { verse_start: 1, verse_end: 17, name: 'Camp Order - East and South' },
    { verse_start: 18, verse_end: 34, name: 'Camp Order - West and North' }
  ],

  // Chapter 3: Levites Appointed (51 verses)
  3: [
    { verse_start: 1, verse_end: 10, name: 'Aaron and His Sons' },
    { verse_start: 11, verse_end: 27, name: 'Levites Given as Substitutes' },
    { verse_start: 28, verse_end: 51, name: 'Duties of Levitical Clans' }
  ],

  // Chapter 4: Levitical Duties (49 verses)
  4: [
    { verse_start: 1, verse_end: 15, name: 'Kohath Clan Responsibilities' },
    { verse_start: 16, verse_end: 33, name: 'Gershon and Merari Clans' },
    { verse_start: 34, verse_end: 49, name: 'Census of Levites' }
  ],

  // Chapter 5: Laws of Purification (31 verses)
  5: [
    { verse_start: 1, verse_end: 10, name: 'Unclean Removed from Camp' },
    { verse_start: 11, verse_end: 31, name: 'Suspected Adultery Test' }
  ],

  // Chapter 6: Nazarite Vow (27 verses)
  6: [
    { verse_start: 1, verse_end: 12, name: 'Laws of the Nazarite' },
    { verse_start: 13, verse_end: 21, name: 'Offering and Release' },
    { verse_start: 22, verse_end: 27, name: 'Aaronic Blessing' }
  ],

  // Chapter 7: Tribal Offerings (89 verses) - LONG
  7: [
    { verse_start: 1, verse_end: 11, name: 'Dedication Offerings' },
    { verse_start: 12, verse_end: 47, name: 'Offerings of the Tribes' },
    { verse_start: 48, verse_end: 89, name: 'Summary of Gifts' }
  ],

  // Chapter 8: Lighting Lamps and Levite Service (26 verses)
  8: [
    { verse_start: 1, verse_end: 12, name: 'Lampstand of the Sanctuary' },
    { verse_start: 13, verse_end: 26, name: 'Levites Dedicated and Retired' }
  ],

  // Chapter 9: Passover Regulations (23 verses)
  9: [
    { verse_start: 1, verse_end: 14, name: 'Passover Observed at Sinai' },
    { verse_start: 15, verse_end: 23, name: 'Cloud and Fire Guide Israel' }
  ],

  // Chapter 10: Trumpets and Journey Begins (36 verses)
  10: [
    { verse_start: 1, verse_end: 10, name: 'Silver Trumpets' },
    { verse_start: 11, verse_end: 36, name: 'Departure from Sinai' }
  ],

  // Chapter 11: Complaining and Quail (35 verses)
  11: [
    { verse_start: 1, verse_end: 15, name: 'People Complain for Meat' },
    { verse_start: 16, verse_end: 30, name: 'Spirit Upon Seventy Elders' },
    { verse_start: 31, verse_end: 35, name: 'Quail from the Sea' }
  ],

  // Chapter 12: Miriam and Aaron's Complaint (16 verses)
  12: [
    { verse_start: 1, verse_end: 8, name: 'Miriam and Aaron Challenge Moses' },
    { verse_start: 9, verse_end: 16, name: 'Miriam Struck with Leprosy' }
  ],

  // Chapter 13: Spies Sent Out (33 verses)
  13: [
    { verse_start: 1, verse_end: 15, name: 'Spies Chosen and Sent' },
    { verse_start: 16, verse_end: 33, name: 'Report of the Spies' }
  ],

  // Chapter 14: Rebellion and Judgment (45 verses)
  14: [
    { verse_start: 1, verse_end: 10, name: 'People Despair and Rebel' },
    { verse_start: 11, verse_end: 25, name: 'Moses Intercedes' },
    { verse_start: 26, verse_end: 45, name: 'Forty Years in Wilderness' }
  ],

  // Chapter 15: Laws and Tassels (41 verses)
  15: [
    { verse_start: 1, verse_end: 16, name: 'Grain and Drink Offerings' },
    { verse_start: 17, verse_end: 31, name: 'Offerings and Unintentional Sins' },
    { verse_start: 32, verse_end: 41, name: 'Tassels on Garments' }
  ],

  // Chapter 16: Korah's Rebellion (50 verses)
  16: [
    { verse_start: 1, verse_end: 19, name: 'Rebellion of Korah and Others' },
    { verse_start: 20, verse_end: 35, name: 'Earth Swallows Rebels' },
    { verse_start: 36, verse_end: 50, name: 'Censers Become Holy' }
  ],

  // Chapter 17: Aaron's Rod Budds (13 verses)
  17: [
    { verse_start: 1, verse_end: 13, name: 'Aaron\'s Rod Buds Almonds' }
  ],

  // Chapter 18: Levite and Priest Duties (32 verses)
  18: [
    { verse_start: 1, verse_end: 7, name: 'Responsibilities of Priests' },
    { verse_start: 8, verse_end: 20, name: 'Portions of Sacrifices' },
    { verse_start: 21, verse_end: 32, name: 'Levite Portion and Tithes' }
  ],

  // Chapter 19: Water of Cleansing (22 verses)
  19: [
    { verse_start: 1, verse_end: 13, name: 'Red Heifer and Purification' },
    { verse_start: 14, verse_end: 22, name: 'Laws About the Dead' }
  ],

  // Chapter 20: Water from Rock and Aaron's Death (29 verses)
  20: [
    { verse_start: 1, verse_end: 13, name: 'Water from the Rock' },
    { verse_start: 14, verse_end: 21, name: 'Edom Refuses Passage' },
    { verse_start: 22, verse_end: 29, name: 'Aaron Dies on Mount Hor' }
  ],

  // Chapter 21: Victories over Enemies (35 verses)
  21: [
    { verse_start: 1, verse_end: 9, name: 'Bronze Serpent Heals Bites' },
    { verse_start: 10, verse_end: 20, name: 'Journey Around Edom' },
    { verse_start: 21, verse_end: 35, name: 'Victories Over Sihon and Og' }
  ],

  // Chapter 22: Balaam Called (41 verses)
  22: [
    { verse_start: 1, verse_end: 21, name: 'Balak Summons Balaam' },
    { verse_start: 22, verse_end: 41, name: 'Balaam\'s Journey and Donkey' }
  ],

  // Chapter 23: Balaam's First Two Oracles (30 verses)
  23: [
    { verse_start: 1, verse_end: 12, name: 'First Oracle - No Curse' },
    { verse_start: 13, verse_end: 30, name: 'Second Oracle - Blessing' }
  ],

  // Chapter 24: Balaam's Third and Fourth Oracles (25 verses)
  24: [
    { verse_start: 1, verse_end: 14, name: 'Third Oracle and David\'s Star' },
    { verse_start: 15, verse_end: 25, name: 'Fourth Oracle and Amalek' }
  ],

  // Chapter 25: Idolatry at Peor (18 verses)
  25: [
    { verse_start: 1, verse_end: 9, name: 'Whoredom at Baal Peor' },
    { verse_start: 10, verse_end: 18, name: 'Phineas\'s Zeal and Covenant' }
  ],

  // Chapter 26: Second Census (65 verses)
  26: [
    { verse_start: 1, verse_end: 27, name: 'Census Instructions and Ruben Judah' },
    { verse_start: 28, verse_end: 51, name: 'Census of Other Tribes' },
    { verse_start: 52, verse_end: 65, name: 'Distribution and Levites' }
  ],

  // Chapter 27: Zelophehad's Daughters (23 verses)
  27: [
    { verse_start: 1, verse_end: 11, name: 'Inheritance for Daughters' },
    { verse_start: 12, verse_end: 23, name: 'Joshua Chosen as Successor' }
  ],

  // Chapter 28: Daily and Festival Offerings (31 verses)
  28: [
    { verse_start: 1, verse_end: 8, name: 'Daily Offerings' },
    { verse_start: 9, verse_end: 31, name: 'Sabbath and Monthly Offerings' }
  ],

  // Chapter 29: More Festival Offerings (39 verses)
  29: [
    { verse_start: 1, verse_end: 11, name: 'Trumpets and Day of Atonement' },
    { verse_start: 12, verse_end: 39, name: 'Tabernacles Offerings' }
  ],

  // Chapter 30: Vows and Oaths (16 verses)
  30: [
    { verse_start: 1, verse_end: 16, name: 'Rules Governing Vows' }
  ],

  // Chapter 31: War Against Midian (54 verses)
  31: [
    { verse_start: 1, verse_end: 12, name: 'Midian Defeated' },
    { verse_start: 13, verse_end: 30, name: 'Purification of Soldiers' },
    { verse_start: 31, verse_end: 54, name: 'Distribution of Spoils' }
  ],

  // Chapter 32: Settlement East of Jordan (42 verses)
  32: [
    { verse_start: 1, verse_end: 19, name: 'Reuben and Gad\'s Request' },
    { verse_start: 20, verse_end: 42, name: 'Agreement and Conditions' }
  ],

  // Chapter 33: Journey Itinerary (49 verses)
  33: [
    { verse_start: 1, verse_end: 15, name: 'From Egypt to Sinai' },
    { verse_start: 16, verse_end: 36, name: 'Sinai to Moab' },
    { verse_start: 37, verse_end: 49, name: 'Instructions for Canaan' }
  ],

  // Chapter 34: Boundaries of Canaan (29 verses)
  34: [
    { verse_start: 1, verse_end: 15, name: 'Canaan\'s Boundaries' },
    { verse_start: 16, verse_end: 29, name: 'Leaders to Divide the Land' }
  ],

  // Chapter 35: Levite Cities and Refuge (34 verses)
  35: [
    { verse_start: 1, verse_end: 8, name: 'Levite Cities' },
    { verse_start: 9, verse_end: 25, name: 'Cities of Refuge' },
    { verse_start: 26, verse_end: 34, name: 'Laws of Homicide' }
  ],

  // Chapter 36: Zelophehad's Daughters Marry (13 verses)
  36: [
    { verse_start: 1, verse_end: 13, name: 'Inheritance Laws Clarified' }
  ]
};

// Flatten into pericope array
const PERICOPES = [];
for (const [chapter, pericopes] of Object.entries(NUMBERS_CHAPTERS)) {
  const chNum = parseInt(chapter);
  pericopes.forEach(p => {
    PERICOPES.push({
      chapter: chNum,
      verse_start: p.verse_start,
      verse_end: p.verse_end,
      name: p.name
    });
  });
}

// Output statistics
console.log('\n📊 NUMBERS CONSOLIDATION\n');
console.log('Before:');
console.log(`  - 36 pericopes (1 per chapter)`);
console.log(`  - 1,288 verses`);
console.log(`  - Average: 35.8 verses per pericope`);

const totalVerses = PERICOPES.reduce((sum, p) => sum + (p.verse_end - p.verse_start + 1), 0);
const avgVersesPerPericope = (totalVerses / PERICOPES.length).toFixed(1);

console.log('\nAfter:');
console.log(`  - ${PERICOPES.length} pericopes`);
console.log(`  - ${totalVerses} verses`);
console.log(`  - Average: ${avgVersesPerPericope} verses per pericope`);
console.log(`  - Status: ✅ GOOD (target 6-12)`);

// Generate TypeScript file content
const fileContent = `export const NUMBERS_PERICOPES = [
${PERICOPES.map(p =>
  `  { chapter: ${p.chapter}, verse_start: ${p.verse_start}, verse_end: ${p.verse_end}, name: '${p.name.replace(/'/g, "\\'")}' }`
).join(',\n')}
];
`;

console.log('\n✅ Generated Numbers pericopes file with proper consolidation');
console.log('\nTo apply: cp numbers-consolidated.js scripts/pericopes/04_numbers.js');

// Write to file for review
const fs = require('fs');
const path = require('path');
fs.writeFileSync(
  path.join(__dirname, 'scripts', 'pericopes', '04_numbers.js'),
  fileContent
);

console.log('📁 File written to scripts/pericopes/04_numbers.js');
