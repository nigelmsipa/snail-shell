#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function verify() {
  const { data: allBooks, error } = await supabase
    .from('bible_books')
    .select('id, name');

  if (error || !allBooks) {
    console.error('Error fetching books:', error?.message);
    return;
  }

  let booksWithData = 0;
  let totalPericopes = 0;
  const booksStatus = [];

  for (const book of allBooks) {
    const { data: pericopes } = await supabase
      .from('bible_pericopes')
      .select('id')
      .eq('book_id', book.id);

    const count = pericopes?.length || 0;
    if (count > 0) {
      booksWithData++;
      totalPericopes += count;
    }

    booksStatus.push({
      name: book.name,
      pericopes: count
    });
  }

  // Sort by name
  booksStatus.sort((a, b) => a.name.localeCompare(b.name));

  console.log('📊 PERICOPE IMPORT VERIFICATION\n');
  console.log('='.repeat(60));

  booksStatus.forEach(b => {
    const status = b.pericopes > 0 ? '✅' : '❌';
    console.log(
      `${status} ${b.name.padEnd(20)} : ${b.pericopes.toString().padStart(3)}`
    );
  });

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Books with pericopes: ${booksWithData}/66`);
  console.log(`📚 Total pericopes: ${totalPericopes}`);
  console.log('='.repeat(60));

  if (booksWithData === 66) {
    console.log('\n🎉 SUCCESS! ALL 66 BOOKS IMPORTED!\n');
  } else {
    console.log(`\n⚠️  ${66 - booksWithData} books still need importing\n`);
  }
}

verify();
