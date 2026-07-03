#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { JAMES_PERICOPES } from './pericopes/59_james.js';
import { PETER1_PERICOPES } from './pericopes/60_1peter.js';
import { PETER2_PERICOPES } from './pericopes/61_2peter.js';
import { JOHN1_PERICOPES } from './pericopes/62_1john.js';
import { JOHN2_PERICOPES } from './pericopes/63_2john.js';
import { JOHN3_PERICOPES } from './pericopes/64_3john.js';
import { JUDE_PERICOPES } from './pericopes/65_jude.js';
import { REVELATION_PERICOPES } from './pericopes/66_revelation.js';

dotenv.config();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error('No Supabase key');

const supabase = createClient(process.env.VITE_SUPABASE_URL, key);
const BOOKS = {
  'James': JAMES_PERICOPES,
  '1 Peter': PETER1_PERICOPES,
  '2 Peter': PETER2_PERICOPES,
  '1 John': JOHN1_PERICOPES,
  '2 John': JOHN2_PERICOPES,
  '3 John': JOHN3_PERICOPES,
  'Jude': JUDE_PERICOPES,
  'Revelation': REVELATION_PERICOPES,
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
  console.log(`\n✅ ${count}/8 books imported\n`);
})().catch(console.error);
