#!/usr/bin/env node
/**
 * Master Pericope Import Script
 * Imports pericopes from modular files for all completed books
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Import all completed pericope modules
import { GENESIS_PERICOPES } from './pericopes/01_genesis.js';
import { MATTHEW_PERICOPES } from './pericopes/40_matthew.js';
import { MARK_PERICOPES } from './pericopes/41_mark.js';
import { LUKE_PERICOPES } from './pericopes/42_luke.js';
import { JOHN_PERICOPES } from './pericopes/43_john.js';
// Import more as they're created...

dotenv.config();

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for pericope import.');
}
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SERVICE_KEY
);

// Book mapping: name -> pericopes array
const BOOKS_TO_IMPORT = {
  // Old Testament
  'Genesis': GENESIS_PERICOPES,

  // New Testament - Gospels (All 4 complete!)
  'Matthew': MATTHEW_PERICOPES,
  'Mark': MARK_PERICOPES,
  'Luke': LUKE_PERICOPES,
  'John': JOHN_PERICOPES,

  // Add more books as they're completed:
  // 'Acts': ACTS_PERICOPES,
  // 'Romans': ROMANS_PERICOPES,
  // 'Psalms': PSALMS_PERICOPES,
  // etc.
};

async function importPericopes(bookName, pericopes) {
  try {
    console.log(`\n🔄 Importing ${bookName}...`);

    // Get book ID
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('id')
      .eq('name', bookName)
      .single();

    if (bookError || !bookData) {
      console.error(`❌ ${bookName} book not found in database`);
      return {
        success: false,
        book: bookName,
        error: 'Book not found'
      };
    }

    const bookId = bookData.id;

    // Clear existing pericopes for this book
    const { error: deleteError } = await supabase
      .from('bible_pericopes')
      .delete()
      .eq('book_id', bookId);

    if (deleteError) {
      console.error(`❌ Error clearing old ${bookName} pericopes:`, deleteError.message);
      return {
        success: false,
        book: bookName,
        error: deleteError.message
      };
    }

    // Prepare records
    const records = pericopes.map((p, index) => ({
      book_id: bookId,
      chapter: p.chapter,
      verse_start: p.verse_start,
      verse_end: p.verse_end,
      name: p.name,
      subtitle: p.subtitle || '',
      display_order: index + 1
    }));

    // Calculate stats
    const totalVerses = pericopes.reduce((sum, p) => sum + (p.verse_end - p.verse_start + 1), 0);
    const avgVerses = (totalVerses / pericopes.length).toFixed(1);

    // Insert all at once
    const { error: insertError } = await supabase
      .from('bible_pericopes')
      .insert(records);

    if (insertError) {
      console.error(`❌ Insert error for ${bookName}:`, insertError.message);
      return {
        success: false,
        book: bookName,
        error: insertError.message
      };
    }

    console.log(`✅ ${bookName}: ${pericopes.length} pericopes (avg ${avgVerses} verses/pericope)`);

    return {
      success: true,
      book: bookName,
      pericopeCount: pericopes.length,
      avgVerses: parseFloat(avgVerses)
    };

  } catch (error) {
    console.error(`❌ Fatal error importing ${bookName}:`, error.message);
    return {
      success: false,
      book: bookName,
      error: error.message
    };
  }
}

async function main() {
  console.log('📖 Bible Pericope Import - Master Script');
  console.log('==========================================\n');

  const results = [];

  for (const [bookName, pericopes] of Object.entries(BOOKS_TO_IMPORT)) {
    const result = await importPericopes(bookName, pericopes);
    results.push(result);
  }

  console.log('\n==========================================');
  console.log('📊 IMPORT SUMMARY\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  if (successful.length > 0) {
    console.log('✅ Successfully imported:');
    successful.forEach(r => {
      console.log(`   ${r.book}: ${r.pericopeCount} pericopes (${r.avgVerses} verses avg)`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed to import:');
    failed.forEach(r => {
      console.log(`   ${r.book}: ${r.error}`);
    });
  }

  console.log(`\n📈 Total: ${successful.length}/${results.length} books imported`);

  // Calculate overall stats
  if (successful.length > 0) {
    const totalPericopes = successful.reduce((sum, r) => sum + r.pericopeCount, 0);
    const avgVersesAll = (successful.reduce((sum, r) => sum + r.avgVerses * r.pericopeCount, 0) / totalPericopes).toFixed(1);
    console.log(`📊 Overall: ${totalPericopes} pericopes, ${avgVersesAll} verses avg`);
  }

  console.log('\n🎉 Import complete!');
}

main();
