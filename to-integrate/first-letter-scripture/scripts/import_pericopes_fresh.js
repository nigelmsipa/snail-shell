#!/usr/bin/env node
/**
 * Fresh Import: Genesis pericopes directly to Supabase
 * Single step, no intermediate files, transparent and reliable
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for pericope import.');
}
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SERVICE_KEY
);

// Genesis pericope data - directly defined
const PERICOPES_DATA = {
  Genesis: [
    // Chapter 1
    { chapter: 1, verse_start: 1, verse_end: 5, name: 'Let There Be Light' },
    { chapter: 1, verse_start: 6, verse_end: 8, name: 'Waters Above and Below' },
    { chapter: 1, verse_start: 9, verse_end: 13, name: 'Dry Land and Vegetation' },
    { chapter: 1, verse_start: 14, verse_end: 19, name: 'Sun, Moon, and Stars' },
    { chapter: 1, verse_start: 20, verse_end: 23, name: 'Sea Creatures and Birds' },
    { chapter: 1, verse_start: 24, verse_end: 31, name: 'Land Animals and Humanity' },

    // Chapter 2
    { chapter: 2, verse_start: 1, verse_end: 3, name: 'The Seventh Day' },
    { chapter: 2, verse_start: 4, verse_end: 6, name: 'Garden Planted' },
    { chapter: 2, verse_start: 7, verse_end: 9, name: 'Man Formed and Positioned' },
    { chapter: 2, verse_start: 10, verse_end: 14, name: 'Rivers of Eden' },
    { chapter: 2, verse_start: 15, verse_end: 17, name: 'Garden Boundaries' },
    { chapter: 2, verse_start: 18, verse_end: 20, name: 'Helper Sought' },
    { chapter: 2, verse_start: 21, verse_end: 25, name: 'Woman Created' },

    // Chapter 3
    { chapter: 3, verse_start: 1, verse_end: 5, name: 'Serpent\'s Deception' },
    { chapter: 3, verse_start: 6, verse_end: 7, name: 'Forbidden Fruit Taken' },
    { chapter: 3, verse_start: 8, verse_end: 13, name: 'Accountability and Blame' },
    { chapter: 3, verse_start: 14, verse_end: 19, name: 'Judgment Pronounced' },
    { chapter: 3, verse_start: 20, verse_end: 24, name: 'Expulsion from Eden' },

    // Chapter 4
    { chapter: 4, verse_start: 1, verse_end: 8, name: 'Cain and Abel\'s Offerings' },
    { chapter: 4, verse_start: 9, verse_end: 15, name: 'Cain\'s Punishment' },
    { chapter: 4, verse_start: 16, verse_end: 26, name: 'Cain\'s Descendants' },

    // Chapter 5
    { chapter: 5, verse_start: 1, verse_end: 32, name: 'Adam to Noah\'s Descendants' },
  ]
};

async function importPericopes() {
  try {
    console.log('🔄 Starting fresh pericope import...\n');

    // Get book ID
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('id')
      .eq('name', 'Genesis')
      .single();

    if (bookError || !bookData) {
      console.error('❌ Genesis book not found');
      process.exit(1);
    }

    const bookId = bookData.id;
    console.log(`✅ Found Genesis (ID: ${bookId})\n`);

    // Clear existing pericopes for Genesis
    const { error: deleteError } = await supabase
      .from('bible_pericopes')
      .delete()
      .eq('book_id', bookId);

    if (deleteError) {
      console.error('❌ Error clearing old pericopes:', deleteError.message);
      process.exit(1);
    }
    console.log('✅ Cleared old pericopes\n');

    // Prepare records with display_order
    const records = PERICOPES_DATA.Genesis.map((p, index) => ({
      book_id: bookId,
      chapter: p.chapter,
      verse_start: p.verse_start,
      verse_end: p.verse_end,
      name: p.name,
      subtitle: '',
      display_order: index + 1
    }));

    // Insert all at once
    const { error: insertError, data: insertedData } = await supabase
      .from('bible_pericopes')
      .insert(records)
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${records.length} pericopes\n`);

    // Verify by chapter
    const { data: verifyData } = await supabase
      .from('bible_pericopes')
      .select('chapter')
      .eq('book_id', bookId)
      .order('chapter', 'display_order');

    if (verifyData) {
      const byChapter = {};
      verifyData.forEach(p => {
        byChapter[p.chapter] = (byChapter[p.chapter] || 0) + 1;
      });

      console.log('📊 Pericopes per chapter:');
      Object.keys(byChapter)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach(ch => {
          console.log(`   Chapter ${ch}: ${byChapter[ch]} pericopes`);
        });

      const totalVerses = Object.values(byChapter).reduce((a, b) => a + b, 0);
      console.log(`\n🎉 Import complete! Total: ${totalVerses} pericopes`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

importPericopes();
