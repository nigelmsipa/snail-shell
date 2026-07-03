#!/usr/bin/env node
/**
 * TORAH PERICOPE IMPORT
 * Import the 5 Torah books to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Import Torah books
import { GENESIS_PERICOPES } from './pericopes/01_genesis.js';
import { EXODUS_PERICOPES } from './pericopes/02_exodus.js';
import { LEVITICUS_PERICOPES } from './pericopes/03_leviticus.js';
import { NUMBERS_PERICOPES } from './pericopes/04_numbers.js';
import { DEUTERONOMY_PERICOPES } from './pericopes/05_deuteronomy.js';

dotenv.config();

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

const TORAH_BOOKS = {
  'Genesis': GENESIS_PERICOPES,
  'Exodus': EXODUS_PERICOPES,
  'Leviticus': LEVITICUS_PERICOPES,
  'Numbers': NUMBERS_PERICOPES,
  'Deuteronomy': DEUTERONOMY_PERICOPES,
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
  console.log('📖 TORAH PERICOPE IMPORT');
  console.log('=' .repeat(50));
  console.log('5 books, comprehensive research outlines\n');

  let success = 0, failed = 0;

  for (const [bookName, pericopes] of Object.entries(TORAH_BOOKS)) {
    (await importPericopes(bookName, pericopes)) ? success++ : failed++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Success: ${success}/5 books`);
  if (failed > 0) console.log(`❌ Failed: ${failed} books`);
  console.log('\n🎉 Import complete!');
}

main();
