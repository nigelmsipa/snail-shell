#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { MATTHEW_PERICOPES } from './pericopes/40_matthew.js';
import { MARK_PERICOPES } from './pericopes/41_mark.js';
import { LUKE_PERICOPES } from './pericopes/42_luke.js';
import { JOHN_PERICOPES } from './pericopes/43_john.js';

dotenv.config();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error('No Supabase key');

const supabase = createClient(process.env.VITE_SUPABASE_URL, key);
const BOOKS = {
  'Matthew': MATTHEW_PERICOPES,
  'Mark': MARK_PERICOPES,
  'Luke': LUKE_PERICOPES,
  'John': JOHN_PERICOPES,
};

(async () => {
  let count = 0;
  for (const [name, pericopes] of Object.entries(BOOKS)) {
    const { data: book } = await supabase.from('bible_books').select('id').eq('name', name).single();
    if (!book) { console.error(`❌ ${name} not found`); continue; }
    await supabase.from('bible_pericopes').delete().eq('book_id', book.id);
    const records = pericopes.map((p, i) => ({
      book_id: book.id, chapter: p.chapter, verse_start: p.verse_start, verse_end: p.verse_end,
      name: p.name.substring(0, 255), subtitle: p.subtitle || '', display_order: i + 1,
      verse_count: p.verse_end - p.verse_start + 1
    }));
    const { error } = await supabase.from('bible_pericopes').insert(records);
    if (error) console.error(`❌ ${name}:`, error.message);
    else { console.log(`✅ ${name}: ${pericopes.length}`); count++; }
  }
  console.log(`\n✅ ${count}/4 books imported\n`);
})().catch(console.error);
