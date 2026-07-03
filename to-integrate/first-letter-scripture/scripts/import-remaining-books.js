#!/usr/bin/env node
/**
 * Import remaining books (John through Revelation) to complete the Bible
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

import { JOHN_PERICOPES } from './pericopes/43_john.js';
import { ACTS_PERICOPES } from './pericopes/44_acts.js';
import { ROMANS_PERICOPES } from './pericopes/45_romans.js';
import { CORINTHIANS1_PERICOPES } from './pericopes/46_1corinthians.js';
import { CORINTHIANS2_PERICOPES } from './pericopes/47_2corinthians.js';
import { GALATIANS_PERICOPES } from './pericopes/48_galatians.js';
import { EPHESIANS_PERICOPES } from './pericopes/49_ephesians.js';
import { PHILIPPIANS_PERICOPES } from './pericopes/50_philippians.js';
import { COLOSSIANS_PERICOPES } from './pericopes/51_colossians.js';
import { THESSALONIANS1_PERICOPES } from './pericopes/52_1thessalonians.js';
import { THESSALONIANS2_PERICOPES } from './pericopes/53_2thessalonians.js';
import { TIMOTHY1_PERICOPES } from './pericopes/54_1timothy.js';
import { TIMOTHY2_PERICOPES } from './pericopes/55_2timothy.js';
import { TITUS_PERICOPES } from './pericopes/56_titus.js';
import { PHILEMON_PERICOPES } from './pericopes/57_philemon.js';
import { HEBREWS_PERICOPES } from './pericopes/58_hebrews.js';
import { JAMES_PERICOPES } from './pericopes/59_james.js';
import { PETER1_PERICOPES } from './pericopes/60_1peter.js';
import { PETER2_PERICOPES } from './pericopes/61_2peter.js';
import { JOHN1_PERICOPES } from './pericopes/62_1john.js';
import { JOHN2_PERICOPES } from './pericopes/63_2john.js';
import { JOHN3_PERICOPES } from './pericopes/64_3john.js';
import { JUDE_PERICOPES } from './pericopes/65_jude.js';
import { REVELATION_PERICOPES } from './pericopes/66_revelation.js';

dotenv.config();

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for pericope import.');
}
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SERVICE_KEY
);

const REMAINING_BOOKS = [
  { number: 43, name: 'John', constant: 'JOHN_PERICOPES', data: JOHN_PERICOPES },
  { number: 44, name: 'Acts', constant: 'ACTS_PERICOPES', data: ACTS_PERICOPES },
  { number: 45, name: 'Romans', constant: 'ROMANS_PERICOPES', data: ROMANS_PERICOPES },
  { number: 46, name: '1 Corinthians', constant: 'CORINTHIANS1_PERICOPES', data: CORINTHIANS1_PERICOPES },
  { number: 47, name: '2 Corinthians', constant: 'CORINTHIANS2_PERICOPES', data: CORINTHIANS2_PERICOPES },
  { number: 48, name: 'Galatians', constant: 'GALATIANS_PERICOPES', data: GALATIANS_PERICOPES },
  { number: 49, name: 'Ephesians', constant: 'EPHESIANS_PERICOPES', data: EPHESIANS_PERICOPES },
  { number: 50, name: 'Philippians', constant: 'PHILIPPIANS_PERICOPES', data: PHILIPPIANS_PERICOPES },
  { number: 51, name: 'Colossians', constant: 'COLOSSIANS_PERICOPES', data: COLOSSIANS_PERICOPES },
  { number: 52, name: '1 Thessalonians', constant: 'THESSALONIANS1_PERICOPES', data: THESSALONIANS1_PERICOPES },
  { number: 53, name: '2 Thessalonians', constant: 'THESSALONIANS2_PERICOPES', data: THESSALONIANS2_PERICOPES },
  { number: 54, name: '1 Timothy', constant: 'TIMOTHY1_PERICOPES', data: TIMOTHY1_PERICOPES },
  { number: 55, name: '2 Timothy', constant: 'TIMOTHY2_PERICOPES', data: TIMOTHY2_PERICOPES },
  { number: 56, name: 'Titus', constant: 'TITUS_PERICOPES', data: TITUS_PERICOPES },
  { number: 57, name: 'Philemon', constant: 'PHILEMON_PERICOPES', data: PHILEMON_PERICOPES },
  { number: 58, name: 'Hebrews', constant: 'HEBREWS_PERICOPES', data: HEBREWS_PERICOPES },
  { number: 59, name: 'James', constant: 'JAMES_PERICOPES', data: JAMES_PERICOPES },
  { number: 60, name: '1 Peter', constant: 'PETER1_PERICOPES', data: PETER1_PERICOPES },
  { number: 61, name: '2 Peter', constant: 'PETER2_PERICOPES', data: PETER2_PERICOPES },
  { number: 62, name: '1 John', constant: 'JOHN1_PERICOPES', data: JOHN1_PERICOPES },
  { number: 63, name: '2 John', constant: 'JOHN2_PERICOPES', data: JOHN2_PERICOPES },
  { number: 64, name: '3 John', constant: 'JOHN3_PERICOPES', data: JOHN3_PERICOPES },
  { number: 65, name: 'Jude', constant: 'JUDE_PERICOPES', data: JUDE_PERICOPES },
  { number: 66, name: 'Revelation', constant: 'REVELATION_PERICOPES', data: REVELATION_PERICOPES }
];

async function importBook(bookName, pericopes) {
  try {
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('id')
      .eq('name', bookName)
      .single();

    if (bookError || !bookData) {
      console.log(`  ⚠️  ${bookName}: Not found in database`);
      return { success: false, count: 0 };
    }

    const bookId = bookData.id;

    // Format pericopes for database
    const records = pericopes.map((p, idx) => ({
      book_id: bookId,
      chapter: p.chapter,
      verse_start: p.verse_start,
      verse_end: p.verse_end,
      name: p.name.substring(0, 255),
      subtitle: p.subtitle || '',
      display_order: idx + 1
    }));

    // Insert (only these books should not have existing data)
    const { error: insertError } = await supabase
      .from('bible_pericopes')
      .insert(records);

    if (insertError) {
      console.log(`  ❌ ${bookName}: ${insertError.message}`);
      return { success: false, count: 0 };
    }

    console.log(`  ✅ ${bookName}: ${records.length} pericopes`);
    return { success: true, count: records.length };

  } catch (error) {
    console.log(`  ❌ ${bookName}: ${error.message}`);
    return { success: false, count: 0 };
  }
}

async function importRemaining() {
  console.log('📖 IMPORTING REMAINING BOOKS (John through Revelation)');
  console.log('='.repeat(60));

  let totalSuccess = 0;
  let totalFailed = 0;
  let totalPericopes = 0;

  for (const book of REMAINING_BOOKS) {
    const result = await importBook(book.name, book.data);

    if (result.success) {
      totalSuccess++;
      totalPericopes += result.count;
    } else {
      totalFailed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${totalSuccess}/24 books`);
  console.log(`❌ Failed: ${totalFailed}/24 books`);
  console.log(`📚 New pericopes: ${totalPericopes}`);
  console.log('='.repeat(60) + '\n');
}

importRemaining().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
