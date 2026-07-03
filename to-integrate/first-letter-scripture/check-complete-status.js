#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function checkStatus() {
  const { data: allBooks } = await supabase.from('bible_books').select('id, name, book_number');

  let booksWithPericopes = 0;
  let totalPericopes = 0;
  const missing = [];

  for (const book of allBooks.sort((a, b) => a.book_number - b.book_number)) {
    const { data: pericopes } = await supabase
      .from('bible_pericopes')
      .select('*')
      .eq('book_id', book.id);

    const count = pericopes?.length || 0;
    if (count > 0) {
      booksWithPericopes++;
      totalPericopes += count;
      console.log(`✅ ${book.book_number.toString().padStart(2)} - ${book.name.padEnd(20)} : ${count.toString().padStart(3)} pericopes`);
    } else {
      missing.push(book.name);
      console.log(`❌ ${book.book_number.toString().padStart(2)} - ${book.name.padEnd(20)} : 0 pericopes`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Books with pericopes: ${booksWithPericopes} / 66`);
  console.log(`📚 Total pericopes imported: ${totalPericopes}`);

  if (missing.length === 0) {
    console.log('\n🎉 SUCCESS! ALL 66 BOOKS HAVE PERICOPES IMPORTED!');
  } else {
    console.log(`\n❌ Missing ${missing.length} books:`);
    missing.forEach(name => console.log(`  - ${name}`));
  }
}

checkStatus();
