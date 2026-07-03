#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ACTS_PERICOPES } from './pericopes/44_acts.js';

dotenv.config();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error('No Supabase key');

const supabase = createClient(process.env.VITE_SUPABASE_URL, key);

(async () => {
  const { data: book } = await supabase.from('bible_books').select('id').eq('name', 'Acts').single();
  if (!book) { console.error(`❌ Acts not found`); process.exit(1); }

  await supabase.from('bible_pericopes').delete().eq('book_id', book.id);
  const records = ACTS_PERICOPES.map((p, i) => ({
    book_id: book.id, chapter: p.chapter, verse_start: p.verse_start, verse_end: p.verse_end,
    name: p.name.substring(0, 255), subtitle: p.subtitle || '', display_order: i + 1,
    verse_count: p.verse_end - p.verse_start + 1
  }));

  const { error } = await supabase.from('bible_pericopes').insert(records);
  if (error) {
    console.error(`❌ Acts:`, error.message);
    process.exit(1);
  }

  console.log(`✅ Acts: ${ACTS_PERICOPES.length} pericopes imported\n`);
})().catch(console.error);
