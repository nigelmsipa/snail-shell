#!/usr/bin/env node
/**
 * Import all Bible books from individual .js pericope files
 * Reads from /scripts/pericopes/*.js and imports into Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for pericope import.');
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SERVICE_KEY
);

// Map of book files to book names for database
const BOOK_MAP = {
  '01_genesis': 'Genesis',
  '02_exodus': 'Exodus',
  '03_leviticus': 'Leviticus',
  '04_numbers': 'Numbers',
  '05_deuteronomy': 'Deuteronomy',
  '06_joshua': 'Joshua',
  '07_judges': 'Judges',
  '08_ruth': 'Ruth',
  '09_1samuel': '1 Samuel',
  '10_2samuel': '2 Samuel',
  '11_1kings': '1 Kings',
  '12_2kings': '2 Kings',
  '13_1chronicles': '1 Chronicles',
  '14_2chronicles': '2 Chronicles',
  '15_ezra': 'Ezra',
  '16_nehemiah': 'Nehemiah',
  '17_esther': 'Esther',
  '18_job': 'Job',
  '19_psalms': 'Psalms',
  '20_proverbs': 'Proverbs',
  '21_ecclesiastes': 'Ecclesiastes',
  '22_songofsol': 'Song of Solomon',
  '23_isaiah': 'Isaiah',
  '24_jeremiah': 'Jeremiah',
  '25_lamentations': 'Lamentations',
  '26_ezekiel': 'Ezekiel',
  '27_daniel': 'Daniel',
  '28_hosea': 'Hosea',
  '29_joel': 'Joel',
  '30_amos': 'Amos',
  '31_obadiah': 'Obadiah',
  '32_jonah': 'Jonah',
  '33_micah': 'Micah',
  '34_nahum': 'Nahum',
  '35_habakkuk': 'Habakkuk',
  '36_zephaniah': 'Zephaniah',
  '37_haggai': 'Haggai',
  '38_zechariah': 'Zechariah',
  '39_malachi': 'Malachi',
  '40_matthew': 'Matthew',
  '41_mark': 'Mark',
  '42_luke': 'Luke',
  '43_john': 'John',
  '44_acts': 'Acts',
  '45_romans': 'Romans',
  '46_1corinthians': '1 Corinthians',
  '47_2corinthians': '2 Corinthians',
  '48_galatians': 'Galatians',
  '49_ephesians': 'Ephesians',
  '50_philippians': 'Philippians',
  '51_colossians': 'Colossians',
  '52_1thessalonians': '1 Thessalonians',
  '53_2thessalonians': '2 Thessalonians',
  '54_1timothy': '1 Timothy',
  '55_2timothy': '2 Timothy',
  '56_titus': 'Titus',
  '57_philemon': 'Philemon',
  '58_hebrews': 'Hebrews',
  '59_james': 'James',
  '60_1peter': '1 Peter',
  '61_2peter': '2 Peter',
  '62_1john': '1 John',
  '63_2john': '2 John',
  '64_3john': '3 John',
  '65_jude': 'Jude',
  '66_revelation': 'Revelation'
};

async function importPericopes(bookName, pericopes) {
  console.log(`📖 Importing ${bookName} (${pericopes.length} pericopes)...`);

  try {
    const records = pericopes.map(p => ({
      book: bookName,
      chapter: p.chapter,
      verse_start: p.verse_start,
      verse_end: p.verse_end,
      name: p.name
    }));

    const { data, error } = await supabase
      .from('bible_pericopes')
      .upsert(records, {
        onConflict: 'book,chapter,verse_start,verse_end',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return false;
    }

    console.log(`  ✅ ${bookName}: ${records.length} pericopes imported`);
    return true;

  } catch (error) {
    console.error(`  ❌ Fatal error importing ${bookName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('📖 Starting Bible Pericope Import from .js files\n');
  console.log('='.repeat(60));

  const pericopeDir = path.join(__dirname, 'pericopes');
  const jsFiles = fs.readdirSync(pericopeDir)
    .filter(f => f.endsWith('.js') && f.match(/^[0-9]{2}_/))
    .sort();

  console.log(`\n📂 Found ${jsFiles.length} pericope files\n`);

  let successCount = 0;
  let failCount = 0;
  let totalPericopes = 0;

  for (const file of jsFiles) {
    const key = file.replace('.js', '');
    const bookName = BOOK_MAP[key];

    if (!bookName) {
      console.log(`⚠️  Unknown book file: ${file}`);
      continue;
    }

    try {
      // Dynamic import of the pericope file
      const module = await import(`./pericopes/${file}`);

      // Get the exported pericope array (usually named like JOSHUA_PERICOPES)
      const constantName = Object.keys(module).find(k => k.includes('PERICOPES'));
      if (!constantName) {
        console.log(`  ⚠️  No PERICOPES export found in ${file}`);
        failCount++;
        continue;
      }

      const pericopes = module[constantName];
      totalPericopes += pericopes.length;

      const success = await importPericopes(bookName, pericopes);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`  ❌ Failed to load ${file}: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Success: ${successCount} books`);
  console.log(`❌ Failed: ${failCount} books`);
  console.log(`📊 Total pericopes: ${totalPericopes}`);
  console.log('\n🎉 Import complete!');
}

main().catch(console.error);
