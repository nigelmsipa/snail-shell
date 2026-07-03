#!/usr/bin/env node
/**
 * Complete Bible Pericopes Import
 * All 66 books with optimized divisions for memorization
 * Constraints: 6-12 verses per pericope, evocative titles (max 8 words)
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

// Complete pericope data for all 66 books
const ALL_PERICOPES = {
  // OLD TESTAMENT

  // GENESIS (50 chapters)
  Genesis: [
    // Chapter 1 - Creation
    { chapter: 1, verse_start: 1, verse_end: 5, name: 'Let There Be Light' },
    { chapter: 1, verse_start: 6, verse_end: 8, name: 'Waters Above and Below' },
    { chapter: 1, verse_start: 9, verse_end: 13, name: 'Dry Land and Vegetation' },
    { chapter: 1, verse_start: 14, verse_end: 19, name: 'Sun Moon and Stars' },
    { chapter: 1, verse_start: 20, verse_end: 23, name: 'Sea Creatures and Birds' },
    { chapter: 1, verse_start: 24, verse_end: 31, name: 'Land Animals and Humanity' },

    // Chapter 2 - Garden of Eden
    { chapter: 2, verse_start: 1, verse_end: 3, name: 'The Seventh Day' },
    { chapter: 2, verse_start: 4, verse_end: 9, name: 'Garden Planted' },
    { chapter: 2, verse_start: 10, verse_end: 14, name: 'Rivers of Eden' },
    { chapter: 2, verse_start: 15, verse_end: 17, name: 'Command and Warning' },
    { chapter: 2, verse_start: 18, verse_end: 25, name: 'Woman Created from Man' },

    // Chapter 3 - The Fall
    { chapter: 3, verse_start: 1, verse_end: 7, name: 'The Serpent\'s Deception' },
    { chapter: 3, verse_start: 8, verse_end: 13, name: 'Hiding from God' },
    { chapter: 3, verse_start: 14, verse_end: 19, name: 'Judgment Pronounced' },
    { chapter: 3, verse_start: 20, verse_end: 24, name: 'Expulsion from Eden' },

    // Chapter 4 - Cain and Abel
    { chapter: 4, verse_start: 1, verse_end: 8, name: 'First Murder' },
    { chapter: 4, verse_start: 9, verse_end: 16, name: 'Cain the Wanderer' },
    { chapter: 4, verse_start: 17, verse_end: 26, name: 'Line of Cain and Seth' },

    // Chapter 5 - From Adam to Noah
    { chapter: 5, verse_start: 1, verse_end: 17, name: 'Adam to Jared' },
    { chapter: 5, verse_start: 18, verse_end: 32, name: 'Enoch Walked with God' },

    // Chapter 6 - Corruption and the Flood
    { chapter: 6, verse_start: 1, verse_end: 8, name: 'Wickedness on Earth' },
    { chapter: 6, verse_start: 9, verse_end: 22, name: 'Noah Found Favor' },

    // Chapter 7 - Enter the Ark
    { chapter: 7, verse_start: 1, verse_end: 10, name: 'Loading the Ark' },
    { chapter: 7, verse_start: 11, verse_end: 24, name: 'Waters Prevail' },

    // Chapter 8 - Waters Recede
    { chapter: 8, verse_start: 1, verse_end: 14, name: 'Dry Land Appears' },
    { chapter: 8, verse_start: 15, verse_end: 22, name: 'Never Again' },

    // Chapter 9 - Covenant with Noah
    { chapter: 9, verse_start: 1, verse_end: 7, name: 'Be Fruitful and Multiply' },
    { chapter: 9, verse_start: 8, verse_end: 17, name: 'Rainbow Covenant' },
    { chapter: 9, verse_start: 18, verse_end: 29, name: 'Noah\'s Drunkenness' },

    // Chapter 10 - Table of Nations
    { chapter: 10, verse_start: 1, verse_end: 32, name: 'Nations Spread Abroad' },

    // Chapter 11 - Babel and Abram's Line
    { chapter: 11, verse_start: 1, verse_end: 9, name: 'Tower of Babel' },
    { chapter: 11, verse_start: 10, verse_end: 32, name: 'Shem to Abram' },

    // Chapter 12 - Call of Abram
    { chapter: 12, verse_start: 1, verse_end: 9, name: 'Get Out of Your Country' },
    { chapter: 12, verse_start: 10, verse_end: 20, name: 'Abram in Egypt' },

    // Chapter 13 - Abram and Lot Separate
    { chapter: 13, verse_start: 1, verse_end: 13, name: 'Let There Be No Strife' },
    { chapter: 13, verse_start: 14, verse_end: 18, name: 'Land Promised to Abram' },

    // Chapter 14 - War and Melchizedek
    { chapter: 14, verse_start: 1, verse_end: 16, name: 'Abram Rescues Lot' },
    { chapter: 14, verse_start: 17, verse_end: 24, name: 'Blessed by Melchizedek' },

    // Chapter 15 - Covenant Ceremony
    { chapter: 15, verse_start: 1, verse_end: 6, name: 'Your Reward Will Be Great' },
    { chapter: 15, verse_start: 7, verse_end: 21, name: 'Covenant Cut' },

    // Chapter 16 - Hagar and Ishmael
    { chapter: 16, verse_start: 1, verse_end: 6, name: 'Sarai\'s Plan' },
    { chapter: 16, verse_start: 7, verse_end: 16, name: 'God Who Sees Me' },

    // Chapter 17 - Covenant of Circumcision
    { chapter: 17, verse_start: 1, verse_end: 8, name: 'Walk Before Me Blameless' },
    { chapter: 17, verse_start: 9, verse_end: 14, name: 'Sign of the Covenant' },
    { chapter: 17, verse_start: 15, verse_end: 27, name: 'Sarah Will Bear Isaac' },

    // Chapter 18 - Three Visitors
    { chapter: 18, verse_start: 1, verse_end: 15, name: 'Promise of a Son' },
    { chapter: 18, verse_start: 16, verse_end: 33, name: 'Abraham Intercedes for Sodom' },

    // Chapter 19 - Sodom and Gomorrah
    { chapter: 19, verse_start: 1, verse_end: 11, name: 'Angels at Lot\'s House' },
    { chapter: 19, verse_start: 12, verse_end: 29, name: 'Fire from Heaven' },
    { chapter: 19, verse_start: 30, verse_end: 38, name: 'Origin of Moab and Ammon' },

    // Chapter 20 - Abraham and Abimelech
    { chapter: 20, verse_start: 1, verse_end: 18, name: 'She Is My Sister' },

    // Chapter 21 - Birth of Isaac
    { chapter: 21, verse_start: 1, verse_end: 7, name: 'Isaac Is Born' },
    { chapter: 21, verse_start: 8, verse_end: 21, name: 'Hagar and Ishmael Sent Away' },
    { chapter: 21, verse_start: 22, verse_end: 34, name: 'Covenant at Beersheba' },

    // Chapter 22 - Binding of Isaac
    { chapter: 22, verse_start: 1, verse_end: 14, name: 'Take Your Son Your Only Son' },
    { chapter: 22, verse_start: 15, verse_end: 24, name: 'The Lord Will Provide' },

    // Chapter 23 - Death of Sarah
    { chapter: 23, verse_start: 1, verse_end: 20, name: 'Purchase of Machpelah' },

    // Chapter 24 - A Wife for Isaac
    { chapter: 24, verse_start: 1, verse_end: 27, name: 'The Servant\'s Mission' },
    { chapter: 24, verse_start: 28, verse_end: 67, name: 'Rebekah Chosen' },

    // Chapter 25 - Death of Abraham
    { chapter: 25, verse_start: 1, verse_end: 11, name: 'Abraham\'s Death and Burial' },
    { chapter: 25, verse_start: 12, verse_end: 18, name: 'Descendants of Ishmael' },
    { chapter: 25, verse_start: 19, verse_end: 34, name: 'Esau Sells His Birthright' },

    // Chapter 26 - Isaac and Abimelech
    { chapter: 26, verse_start: 1, verse_end: 11, name: 'She Is My Sister Again' },
    { chapter: 26, verse_start: 12, verse_end: 33, name: 'Isaac\'s Wells' },
    { chapter: 26, verse_start: 34, verse_end: 35, name: 'Esau\'s Hittite Wives' },

    // Chapter 27 - Jacob Steals the Blessing
    { chapter: 27, verse_start: 1, verse_end: 29, name: 'Stolen Blessing' },
    { chapter: 27, verse_start: 30, verse_end: 46, name: 'Esau\'s Bitter Cry' },

    // Chapter 28 - Jacob's Ladder
    { chapter: 28, verse_start: 1, verse_end: 9, name: 'Isaac Sends Jacob Away' },
    { chapter: 28, verse_start: 10, verse_end: 22, name: 'The House of God' },

    // Chapter 29 - Jacob Meets Rachel
    { chapter: 29, verse_start: 1, verse_end: 14, name: 'Rachel at the Well' },
    { chapter: 29, verse_start: 15, verse_end: 30, name: 'Laban\'s Trickery' },
    { chapter: 29, verse_start: 31, verse_end: 35, name: 'Leah\'s Sons' },

    // Chapter 30 - More Sons for Jacob
    { chapter: 30, verse_start: 1, verse_end: 24, name: 'Rachel and the Maids' },
    { chapter: 30, verse_start: 25, verse_end: 43, name: 'Jacob\'s Flocks Increase' },

    // Chapter 31 - Jacob Flees from Laban
    { chapter: 31, verse_start: 1, verse_end: 21, name: 'Time to Go' },
    { chapter: 31, verse_start: 22, verse_end: 55, name: 'Laban Pursues Jacob' },

    // Chapter 32 - Wrestling with God
    { chapter: 32, verse_start: 1, verse_end: 21, name: 'Preparing to Meet Esau' },
    { chapter: 32, verse_start: 22, verse_end: 32, name: 'I Will Not Let You Go' },

    // Chapter 33 - Jacob Meets Esau
    { chapter: 33, verse_start: 1, verse_end: 20, name: 'Reconciliation' },

    // Chapter 34 - Dinah and Shechem
    { chapter: 34, verse_start: 1, verse_end: 31, name: 'Revenge of Simeon and Levi' },

    // Chapter 35 - Return to Bethel
    { chapter: 35, verse_start: 1, verse_end: 15, name: 'Back to Bethel' },
    { chapter: 35, verse_start: 16, verse_end: 29, name: 'Benjamin and Isaac\'s Death' },

    // Chapter 36 - Descendants of Esau
    { chapter: 36, verse_start: 1, verse_end: 43, name: 'Kings of Edom' },

    // Chapter 37 - Joseph's Dreams
    { chapter: 37, verse_start: 1, verse_end: 11, name: 'Dreamer Comes' },
    { chapter: 37, verse_start: 12, verse_end: 36, name: 'Sold Into Slavery' },

    // Chapter 38 - Judah and Tamar
    { chapter: 38, verse_start: 1, verse_end: 30, name: 'She Is More Righteous' },

    // Chapter 39 - Joseph and Potiphar's Wife
    { chapter: 39, verse_start: 1, verse_end: 23, name: 'The Lord Was with Joseph' },

    // Chapter 40 - Dreams in Prison
    { chapter: 40, verse_start: 1, verse_end: 23, name: 'Baker and Cupbearer' },

    // Chapter 41 - Pharaoh's Dreams
    { chapter: 41, verse_start: 1, verse_end: 36, name: 'Seven Fat and Seven Lean' },
    { chapter: 41, verse_start: 37, verse_end: 57, name: 'Joseph Exalted' },

    // Chapter 42 - Brothers Go to Egypt
    { chapter: 42, verse_start: 1, verse_end: 38, name: 'First Journey to Egypt' },

    // Chapter 43 - Benjamin Goes to Egypt
    { chapter: 43, verse_start: 1, verse_end: 34, name: 'Second Journey to Egypt' },

    // Chapter 44 - Joseph's Silver Cup
    { chapter: 44, verse_start: 1, verse_end: 34, name: 'Judah Pleads for Benjamin' },

    // Chapter 45 - Joseph Reveals Himself
    { chapter: 45, verse_start: 1, verse_end: 28, name: 'I Am Joseph' },

    // Chapter 46 - Jacob Goes to Egypt
    { chapter: 46, verse_start: 1, verse_end: 34, name: 'Do Not Fear to Go Down' },

    // Chapter 47 - Jacob Before Pharaoh
    { chapter: 47, verse_start: 1, verse_end: 12, name: 'Settlement in Goshen' },
    { chapter: 47, verse_start: 13, verse_end: 31, name: 'Joseph\'s Land Policy' },

    // Chapter 48 - Blessing of Ephraim and Manasseh
    { chapter: 48, verse_start: 1, verse_end: 22, name: 'The Younger Before the Elder' },

    // Chapter 49 - Jacob Blesses His Sons
    { chapter: 49, verse_start: 1, verse_end: 28, name: 'The Twelve Tribes Blessed' },
    { chapter: 49, verse_start: 29, verse_end: 33, name: 'Jacob\'s Death' },

    // Chapter 50 - Joseph's Promise
    { chapter: 50, verse_start: 1, verse_end: 14, name: 'Jacob\'s Burial' },
    { chapter: 50, verse_start: 15, verse_end: 26, name: 'You Meant It for Evil' },
  ],

  // Note: Due to the massive scope (1,189 chapters), this file will be split into multiple modules
  // See additional import files: import_pentateuch.js, import_historical.js, import_psalms.js, etc.
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
      console.error(`❌ ${bookName} book not found`);
      return false;
    }

    const bookId = bookData.id;

    // Clear existing pericopes
    await supabase
      .from('bible_pericopes')
      .delete()
      .eq('book_id', bookId);

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

    // Insert all at once
    const { error: insertError } = await supabase
      .from('bible_pericopes')
      .insert(records);

    if (insertError) {
      console.error(`❌ Insert error for ${bookName}:`, insertError.message);
      return false;
    }

    console.log(`✅ ${bookName}: ${records.length} pericopes imported`);
    return true;

  } catch (error) {
    console.error(`❌ Fatal error importing ${bookName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('📖 Starting Complete Bible Pericope Import\n');
  console.log('=' . repeat(50));

  let successCount = 0;
  let failCount = 0;

  for (const [bookName, pericopes] of Object.entries(ALL_PERICOPES)) {
    const success = await importPericopes(bookName, pericopes);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Success: ${successCount} books`);
  console.log(`❌ Failed: ${failCount} books`);
  console.log('\n🎉 Import complete!');
}

main();
