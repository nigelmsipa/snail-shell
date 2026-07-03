#!/usr/bin/env node
/**
 * COMPLETE BIBLE PERICOPE IMPORT
 * All 66 books, 1,189 chapters
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Import all 66 books - USING ENHANCED AUTO-GENERATED PERICOPES
import { GENESIS_PERICOPES } from './pericopes/01_genesis.js';
import { EXODUS_PERICOPES } from './pericopes/02_exodus.js';
import { LEVITICUS_PERICOPES } from './pericopes/03_leviticus.js';
import { NUMBERS_PERICOPES } from './pericopes/04_numbers.js';
import { DEUTERONOMY_PERICOPES } from './pericopes/05_deuteronomy.js';
import { JOSHUA_PERICOPES } from './pericopes_generated/06_joshua.js';
import { JUDGES_PERICOPES } from './pericopes_generated/07_judges.js';
import { RUTH_PERICOPES } from './pericopes_generated/08_ruth.js';
import { SAMUEL1_PERICOPES } from './pericopes_generated/09_1samuel.js';
import { SAMUEL2_PERICOPES } from './pericopes_generated/10_2samuel.js';
import { KINGS1_PERICOPES } from './pericopes_generated/11_1kings.js';
import { KINGS2_PERICOPES } from './pericopes_generated/12_2kings.js';
import { CHRONICLES1_PERICOPES } from './pericopes_generated/13_1chronicles.js';
import { CHRONICLES2_PERICOPES } from './pericopes_generated/14_2chronicles.js';
import { EZRA_PERICOPES } from './pericopes_generated/15_ezra.js';
import { NEHEMIAH_PERICOPES } from './pericopes_generated/16_nehemiah.js';
import { ESTHER_PERICOPES } from './pericopes_generated/17_esther.js';
import { JOB_PERICOPES } from './pericopes_generated/18_job.js';
import { PSALMS_PERICOPES } from './pericopes_generated/19_psalms.js';
import { PROVERBS_PERICOPES } from './pericopes_generated/20_proverbs.js';
import { ECCLESIASTES_PERICOPES } from './pericopes_generated/21_ecclesiastes.js';
import { SONGOFSOL_PERICOPES } from './pericopes_generated/22_songofsol.js';
import { ISAIAH_PERICOPES } from './pericopes_generated/23_isaiah.js';
import { JEREMIAH_PERICOPES } from './pericopes_generated/24_jeremiah.js';
import { LAMENTATIONS_PERICOPES } from './pericopes_generated/25_lamentations.js';
import { EZEKIEL_PERICOPES } from './pericopes_generated/26_ezekiel.js';
import { DANIEL_PERICOPES } from './pericopes_generated/27_daniel.js';
import { HOSEA_PERICOPES } from './pericopes_generated/28_hosea.js';
import { JOEL_PERICOPES } from './pericopes_generated/29_joel.js';
import { AMOS_PERICOPES } from './pericopes_generated/30_amos.js';
import { OBADIAH_PERICOPES } from './pericopes_generated/31_obadiah.js';
import { JONAH_PERICOPES } from './pericopes_generated/32_jonah.js';
import { MICAH_PERICOPES } from './pericopes_generated/33_micah.js';
import { NAHUM_PERICOPES } from './pericopes_generated/34_nahum.js';
import { HABAKKUK_PERICOPES } from './pericopes_generated/35_habakkuk.js';
import { ZEPHANIAH_PERICOPES } from './pericopes_generated/36_zephaniah.js';
import { HAGGAI_PERICOPES } from './pericopes_generated/37_haggai.js';
import { ZECHARIAH_PERICOPES } from './pericopes_generated/38_zechariah.js';
import { MALACHI_PERICOPES } from './pericopes_generated/39_malachi.js';
import { MATTHEW_PERICOPES } from './pericopes_generated/40_matthew.js';
import { MARK_PERICOPES } from './pericopes_generated/41_mark.js';
import { LUKE_PERICOPES } from './pericopes_generated/42_luke.js';
import { JOHN_PERICOPES } from './pericopes_generated/43_john.js';
import { ACTS_PERICOPES } from './pericopes_generated/44_acts.js';
import { ROMANS_PERICOPES } from './pericopes_generated/45_romans.js';
import { CORINTHIANS1_PERICOPES } from './pericopes_generated/46_1corinthians.js';
import { CORINTHIANS2_PERICOPES } from './pericopes_generated/47_2corinthians.js';
import { GALATIANS_PERICOPES } from './pericopes_generated/48_galatians.js';
import { EPHESIANS_PERICOPES } from './pericopes_generated/49_ephesians.js';
import { PHILIPPIANS_PERICOPES } from './pericopes_generated/50_philippians.js';
import { COLOSSIANS_PERICOPES } from './pericopes_generated/51_colossians.js';
import { THESSALONIANS1_PERICOPES } from './pericopes_generated/52_1thessalonians.js';
import { THESSALONIANS2_PERICOPES } from './pericopes_generated/53_2thessalonians.js';
import { TIMOTHY1_PERICOPES } from './pericopes_generated/54_1timothy.js';
import { TIMOTHY2_PERICOPES } from './pericopes_generated/55_2timothy.js';
import { TITUS_PERICOPES } from './pericopes_generated/56_titus.js';
import { PHILEMON_PERICOPES } from './pericopes_generated/57_philemon.js';
import { HEBREWS_PERICOPES } from './pericopes_generated/58_hebrews.js';
import { JAMES_PERICOPES } from './pericopes_generated/59_james.js';
import { PETER1_PERICOPES } from './pericopes_generated/60_1peter.js';
import { PETER2_PERICOPES } from './pericopes_generated/61_2peter.js';
import { JOHN1_PERICOPES } from './pericopes_generated/62_1john.js';
import { JOHN2_PERICOPES } from './pericopes_generated/63_2john.js';
import { JOHN3_PERICOPES } from './pericopes_generated/64_3john.js';
import { JUDE_PERICOPES } from './pericopes_generated/65_jude.js';
import { REVELATION_PERICOPES } from './pericopes_generated/66_revelation.js';

dotenv.config();

// For Lovable users: Using regular key instead of service role
// Note: This may have limitations on delete operations
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_KEY) {
  console.error('\n⚠️  No Supabase key found.');
  console.error('Please ensure VITE_SUPABASE_PUBLISHABLE_KEY is set in .env');
  throw new Error('No Supabase key available. Aborting.');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('\n⚠️  Using public key - delete operations may be limited.');
  console.warn('If deletes fail, manually clear pericopes in Supabase dashboard first.\n');
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SUPABASE_KEY
);

const BOOKS = {
  'Genesis': GENESIS_PERICOPES,
  'Exodus': EXODUS_PERICOPES,
  'Leviticus': LEVITICUS_PERICOPES,
  'Numbers': NUMBERS_PERICOPES,
  'Deuteronomy': DEUTERONOMY_PERICOPES,
  'Joshua': JOSHUA_PERICOPES,
  'Judges': JUDGES_PERICOPES,
  'Ruth': RUTH_PERICOPES,
  '1 Samuel': SAMUEL1_PERICOPES,
  '2 Samuel': SAMUEL2_PERICOPES,
  '1 Kings': KINGS1_PERICOPES,
  '2 Kings': KINGS2_PERICOPES,
  '1 Chronicles': CHRONICLES1_PERICOPES,
  '2 Chronicles': CHRONICLES2_PERICOPES,
  'Ezra': EZRA_PERICOPES,
  'Nehemiah': NEHEMIAH_PERICOPES,
  'Esther': ESTHER_PERICOPES,
  'Job': JOB_PERICOPES,
  'Psalms': PSALMS_PERICOPES,
  'Proverbs': PROVERBS_PERICOPES,
  'Ecclesiastes': ECCLESIASTES_PERICOPES,
  'Song of Solomon': SONGOFSOL_PERICOPES,
  'Isaiah': ISAIAH_PERICOPES,
  'Jeremiah': JEREMIAH_PERICOPES,
  'Lamentations': LAMENTATIONS_PERICOPES,
  'Ezekiel': EZEKIEL_PERICOPES,
  'Daniel': DANIEL_PERICOPES,
  'Hosea': HOSEA_PERICOPES,
  'Joel': JOEL_PERICOPES,
  'Amos': AMOS_PERICOPES,
  'Obadiah': OBADIAH_PERICOPES,
  'Jonah': JONAH_PERICOPES,
  'Micah': MICAH_PERICOPES,
  'Nahum': NAHUM_PERICOPES,
  'Habakkuk': HABAKKUK_PERICOPES,
  'Zephaniah': ZEPHANIAH_PERICOPES,
  'Haggai': HAGGAI_PERICOPES,
  'Zechariah': ZECHARIAH_PERICOPES,
  'Malachi': MALACHI_PERICOPES,
  'Matthew': MATTHEW_PERICOPES,
  'Mark': MARK_PERICOPES,
  'Luke': LUKE_PERICOPES,
  'John': JOHN_PERICOPES,
  'Acts': ACTS_PERICOPES,
  'Romans': ROMANS_PERICOPES,
  '1 Corinthians': CORINTHIANS1_PERICOPES,
  '2 Corinthians': CORINTHIANS2_PERICOPES,
  'Galatians': GALATIANS_PERICOPES,
  'Ephesians': EPHESIANS_PERICOPES,
  'Philippians': PHILIPPIANS_PERICOPES,
  'Colossians': COLOSSIANS_PERICOPES,
  '1 Thessalonians': THESSALONIANS1_PERICOPES,
  '2 Thessalonians': THESSALONIANS2_PERICOPES,
  '1 Timothy': TIMOTHY1_PERICOPES,
  '2 Timothy': TIMOTHY2_PERICOPES,
  'Titus': TITUS_PERICOPES,
  'Philemon': PHILEMON_PERICOPES,
  'Hebrews': HEBREWS_PERICOPES,
  'James': JAMES_PERICOPES,
  '1 Peter': PETER1_PERICOPES,
  '2 Peter': PETER2_PERICOPES,
  '1 John': JOHN1_PERICOPES,
  '2 John': JOHN2_PERICOPES,
  '3 John': JOHN3_PERICOPES,
  'Jude': JUDE_PERICOPES,
  'Revelation': REVELATION_PERICOPES,
};

async function importPericopes(bookName, pericopes) {
  try {
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('id')
      .eq('name', bookName)
      .single();

    if (bookError || !bookData) {
      console.error(`❌ ${bookName} not found`);
      return false;
    }

    const bookId = bookData.id;

    // Delete existing pericopes for this book (clean slate)
    const { error: deleteError } = await supabase
      .from('bible_pericopes')
      .delete()
      .eq('book_id', bookId);

    if (deleteError) {
      console.warn(`⚠️  Could not delete existing ${bookName} pericopes:`, deleteError.message);
    }

    const records = pericopes.map((p, index) => ({
      book_id: bookId,
      chapter: p.chapter,
      verse_start: p.verse_start,
      verse_end: p.verse_end,
      name: p.name.substring(0, 255), // Truncate to 255 chars
      subtitle: p.subtitle || '',
      display_order: index + 1,
      verse_count: p.verse_end - p.verse_start + 1
    }));

    // Insert new pericopes
    const { error } = await supabase
      .from('bible_pericopes')
      .insert(records);

    if (error) {
      console.error(`❌ ${bookName}: ${error.message}`);
      return false;
    }

    console.log(`✅ ${bookName}: ${pericopes.length} pericopes`);
    return true;
  } catch (error) {
    console.error(`❌ ${bookName}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('📖 COMPLETE BIBLE PERICOPE IMPORT');
  console.log('=' .repeat(50));
  console.log('All 66 books, 1,189 chapters\n');

  let success = 0, failed = 0;

  for (const [bookName, pericopes] of Object.entries(BOOKS)) {
    (await importPericopes(bookName, pericopes)) ? success++ : failed++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Success: ${success}/66 books`);
  if (failed > 0) console.log(`❌ Failed: ${failed} books`);
  console.log('\n🎉 Import complete!');
}

main();
