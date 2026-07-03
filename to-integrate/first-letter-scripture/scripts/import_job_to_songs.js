#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { JOB_PERICOPES } from './pericopes/18_job.js';
import { PSALMS_PERICOPES } from './pericopes/19_psalms.js';
import { PROVERBS_PERICOPES } from './pericopes/20_proverbs.js';
import { ECCLESIASTES_PERICOPES } from './pericopes/21_ecclesiastes.js';
import { SONGOFSOL_PERICOPES } from './pericopes/22_songofsol.js';

dotenv.config();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error('No Supabase key');

const supabase = createClient(process.env.VITE_SUPABASE_URL, key);
const BOOKS = {
  'Job': JOB_PERICOPES,
  'Psalms': PSALMS_PERICOPES,
  'Proverbs': PROVERBS_PERICOPES,
  'Ecclesiastes': ECCLESIASTES_PERICOPES,
  'Song of Solomon': SONGOFSOL_PERICOPES,
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
  console.log(`\n✅ ${count}/5 books imported\n`);
})().catch(console.error);
