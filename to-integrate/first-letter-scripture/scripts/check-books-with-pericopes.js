#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function checkBooks() {
  try {
    // Get count of pericopes per book
    const { data: allPericopes, error: pericopesError } = await supabase
      .from('bible_pericopes')
      .select('book_id');

    if (pericopesError) throw pericopesError;

    // Count by book_id
    const bookCounts = {};
    allPericopes.forEach(p => {
      bookCounts[p.book_id] = (bookCounts[p.book_id] || 0) + 1;
    });

    // Get book names
    const bookIds = Object.keys(bookCounts);
    if (bookIds.length === 0) {
      console.log('No pericopes found in database');
      process.exit(0);
    }

    const { data: books, error: booksError } = await supabase
      .from('bible_books')
      .select('id, name')
      .in('id', bookIds.map(id => id));

    if (booksError) throw booksError;

    console.log('\n📚 Books with pericopes:');
    books.forEach(book => {
      const count = bookCounts[book.id];
      console.log(`  ✅ ${book.name.padEnd(20)} - ${count} pericopes`);
    });
    
    const total = Object.values(bookCounts).reduce((a, b) => a + b, 0);
    console.log(`\n📊 Total: ${books.length} books, ${total} pericopes\n`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkBooks();
