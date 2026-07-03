#!/usr/bin/env node
/**
 * Audit all pericope files to identify fragmentation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pericopesDir = path.join(__dirname, 'scripts', 'pericopes');

// Book metadata
const BOOKS = [
  { num: 1, name: 'Genesis' },
  { num: 2, name: 'Exodus' },
  { num: 3, name: 'Leviticus' },
  { num: 4, name: 'Numbers' },
  { num: 5, name: 'Deuteronomy' },
  { num: 6, name: 'Joshua' },
  { num: 7, name: 'Judges' },
  { num: 8, name: 'Ruth' },
  { num: 9, name: '1 Samuel' },
  { num: 10, name: '2 Samuel' },
  { num: 11, name: '1 Kings' },
  { num: 12, name: '2 Kings' },
  { num: 13, name: '1 Chronicles' },
  { num: 14, name: '2 Chronicles' },
  { num: 15, name: 'Ezra' },
  { num: 16, name: 'Nehemiah' },
  { num: 17, name: 'Esther' },
  { num: 18, name: 'Job' },
  { num: 19, name: 'Psalms' },
  { num: 20, name: 'Proverbs' },
  { num: 21, name: 'Ecclesiastes' },
  { num: 22, name: 'Song of Solomon' },
  { num: 23, name: 'Isaiah' },
  { num: 24, name: 'Jeremiah' },
  { num: 25, name: 'Lamentations' },
  { num: 26, name: 'Ezekiel' },
  { num: 27, name: 'Daniel' },
  { num: 28, name: 'Hosea' },
  { num: 29, name: 'Joel' },
  { num: 30, name: 'Amos' },
  { num: 31, name: 'Obadiah' },
  { num: 32, name: 'Jonah' },
  { num: 33, name: 'Micah' },
  { num: 34, name: 'Nahum' },
  { num: 35, name: 'Habakkuk' },
  { num: 36, name: 'Zephaniah' },
  { num: 37, name: 'Haggai' },
  { num: 38, name: 'Zechariah' },
  { num: 39, name: 'Malachi' },
  { num: 40, name: 'Matthew' },
  { num: 41, name: 'Mark' },
  { num: 42, name: 'Luke' },
  { num: 43, name: 'John' },
  { num: 44, name: 'Acts' },
  { num: 45, name: 'Romans' },
  { num: 46, name: '1 Corinthians' },
  { num: 47, name: '2 Corinthians' },
  { num: 48, name: 'Galatians' },
  { num: 49, name: 'Ephesians' },
  { num: 50, name: 'Philippians' },
  { num: 51, name: 'Colossians' },
  { num: 52, name: '1 Thessalonians' },
  { num: 53, name: '2 Thessalonians' },
  { num: 54, name: '1 Timothy' },
  { num: 55, name: '2 Timothy' },
  { num: 56, name: 'Titus' },
  { num: 57, name: 'Philemon' },
  { num: 58, name: 'Hebrews' },
  { num: 59, name: 'James' },
  { num: 60, name: '1 Peter' },
  { num: 61, name: '2 Peter' },
  { num: 62, name: '1 John' },
  { num: 63, name: '2 John' },
  { num: 64, name: '3 John' },
  { num: 65, name: 'Jude' },
  { num: 66, name: 'Revelation' },
];

// Chapter counts for each book
const CHAPTER_COUNTS = {
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
  'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
  'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
  'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
  'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
  '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
  'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
  '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
  'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  'Jude': 1, 'Revelation': 22
};

const results = [];

for (const book of BOOKS) {
  try {
    const fileNum = String(book.num).padStart(2, '0');
    const bookSlug = book.name.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/'/g, '');
    const filePath = path.join(pericopesDir, `${fileNum}_${bookSlug}.js`);

    if (!fs.existsSync(filePath)) {
      results.push({
        num: book.num,
        name: book.name,
        status: 'MISSING',
        chapters: CHAPTER_COUNTS[book.name] || '?',
        pericopes: 0,
        verses: 0,
        avgVersesPerPericope: 0,
      });
      continue;
    }

    // Read and parse the file
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract pericope array using regex
    const arrayMatch = content.match(/\[\s*([\s\S]*?)\s*\]/);
    if (!arrayMatch) {
      results.push({
        num: book.num,
        name: book.name,
        status: 'ERROR',
        chapters: CHAPTER_COUNTS[book.name] || '?',
        pericopes: 0,
        verses: 0,
        avgVersesPerPericope: 0,
      });
      continue;
    }

    // Count pericopes and calculate total verses
    const pericopeMatches = content.match(/chapter:\s*\d+,\s*verse_start:\s*\d+,\s*verse_end:\s*\d+/g) || [];
    const pericopes = pericopeMatches.length;

    let totalVerses = 0;
    const verseMatches = content.match(/verse_end:\s*(\d+)/g) || [];
    const verseStartMatches = content.match(/verse_start:\s*(\d+)/g) || [];

    for (let i = 0; i < Math.min(verseMatches.length, verseStartMatches.length); i++) {
      const endVerse = parseInt(verseMatches[i].match(/\d+/)[0]);
      const startVerse = parseInt(verseStartMatches[i].match(/\d+/)[0]);
      totalVerses += (endVerse - startVerse + 1);
    }

    const avgVersesPerPericope = pericopes > 0 ? (totalVerses / pericopes).toFixed(1) : 0;

    // Determine status
    let status = 'OK';
    if (avgVersesPerPericope < 6) status = '🔴 OVERFRAGMENTED (<6)';
    else if (avgVersesPerPericope > 12) status = '⚠️ DENSE (>12)';
    else status = '✅ GOOD (6-12)';

    results.push({
      num: book.num,
      name: book.name,
      status,
      chapters: CHAPTER_COUNTS[book.name] || '?',
      pericopes,
      verses: totalVerses,
      avgVersesPerPericope,
    });
  } catch (error) {
    results.push({
      num: book.num,
      name: book.name,
      status: 'ERROR',
      chapters: CHAPTER_COUNTS[book.name] || '?',
      pericopes: 0,
      verses: 0,
      avgVersesPerPericope: 0,
    });
  }
}

// Display results
console.log('\n📊 PERICOPE FRAGMENTATION AUDIT\n');
console.log('═'.repeat(100));

// Summary by status
const overfragmented = results.filter(r => r.status.includes('🔴'));
const dense = results.filter(r => r.status.includes('⚠️'));
const good = results.filter(r => r.status.includes('✅'));
const missing = results.filter(r => r.status === 'MISSING');

console.log(`\n✅ GOOD (6-12 v/p): ${good.length} books`);
console.log(`⚠️  DENSE (>12 v/p): ${dense.length} books`);
console.log(`🔴 OVERFRAGMENTED (<6 v/p): ${overfragmented.length} books`);
console.log(`❌ MISSING: ${missing.length} books`);

// Overfragmented books (Priority 1)
if (overfragmented.length > 0) {
  console.log('\n🔴 CRITICAL - OVERFRAGMENTED BOOKS (need consolidation):');
  console.log('─'.repeat(100));
  console.log('Num | Name                  | Chaps | Pericopes | Verses | Avg V/P | Status');
  console.log('─'.repeat(100));
  overfragmented.forEach(b => {
    console.log(
      `${String(b.num).padStart(3)} | ${b.name.padEnd(20)} | ${String(b.chapters).padStart(5)} | ${String(b.pericopes).padStart(9)} | ${String(b.verses).padStart(6)} | ${String(b.avgVersesPerPericope).padStart(7)} | ${b.status}`
    );
  });
}

// Dense books (Priority 2)
if (dense.length > 0) {
  console.log('\n⚠️  DENSE - BOOKS ABOVE TARGET (consider consolidation):');
  console.log('─'.repeat(100));
  console.log('Num | Name                  | Chaps | Pericopes | Verses | Avg V/P | Status');
  console.log('─'.repeat(100));
  dense.forEach(b => {
    console.log(
      `${String(b.num).padStart(3)} | ${b.name.padEnd(20)} | ${String(b.chapters).padStart(5)} | ${String(b.pericopes).padStart(9)} | ${String(b.verses).padStart(6)} | ${String(b.avgVersesPerPericope).padStart(7)} | ${b.status}`
    );
  });
}

// All good books
console.log('\n✅ GOOD - PROPERLY CONSOLIDATED BOOKS:');
console.log('─'.repeat(100));
console.log('Num | Name                  | Chaps | Pericopes | Verses | Avg V/P | Status');
console.log('─'.repeat(100));
good.slice(0, 20).forEach(b => {
  console.log(
    `${String(b.num).padStart(3)} | ${b.name.padEnd(20)} | ${String(b.chapters).padStart(5)} | ${String(b.pericopes).padStart(9)} | ${String(b.verses).padStart(6)} | ${String(b.avgVersesPerPericope).padStart(7)} | ${b.status}`
  );
});
if (good.length > 20) {
  console.log(`... and ${good.length - 20} more good books`);
}

// Missing books
if (missing.length > 0) {
  console.log('\n❌ MISSING - PERICOPE FILES NOT FOUND:');
  console.log('─'.repeat(100));
  missing.forEach(b => {
    console.log(`${String(b.num).padStart(3)} | ${b.name.padEnd(20)} - File not found`);
  });
}

console.log('\n═'.repeat(100));
console.log(`\nTotal: ${results.length} books analyzed`);
console.log(`  ✅ Good: ${good.length}`);
console.log(`  ⚠️  Dense: ${dense.length}`);
console.log(`  🔴 Fragmented: ${overfragmented.length}`);
console.log(`  ❌ Missing: ${missing.length}`);
