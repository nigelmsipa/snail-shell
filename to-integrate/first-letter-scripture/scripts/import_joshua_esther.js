#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { JOSHUA_PERICOPES } from './pericopes/06_joshua.js';
import { JUDGES_PERICOPES } from './pericopes/07_judges.js';
import { RUTH_PERICOPES } from './pericopes/08_ruth.js';
import { SAMUEL1_PERICOPES } from './pericopes/09_1samuel.js';
import { SAMUEL2_PERICOPES } from './pericopes/10_2samuel.js';
import { KINGS1_PERICOPES } from './pericopes/11_1kings.js';
import { KINGS2_PERICOPES } from './pericopes/12_2kings.js';
import { CHR1_PERICOPES } from './pericopes/13_1chronicles.js';
import { CHR2_PERICOPES } from './pericopes/14_2chronicles.js';
import { EZRA_PERICOPES } from './pericopes/15_ezra.js';
import { NEHEMIAH_PERICOPES } from './pericopes/16_nehemiah.js';
import { ESTHER_PERICOPES } from './pericopes/17_esther.js';

dotenv.config();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error('No Supabase key');

const supabase = createClient(process.env.VITE_SUPABASE_URL, key);
const BOOKS = {
  'Joshua': JOSHUA_PERICOPES, 'Judges': JUDGES_PERICOPES, 'Ruth': RUTH_PERICOPES,
  '1 Samuel': SAMUEL1_PERICOPES, '2 Samuel': SAMUEL2_PERICOPES,
  '1 Kings': KINGS1_PERICOPES, '2 Kings': KINGS2_PERICOPES,
  '1 Chronicles': CHR1_PERICOPES, '2 Chronicles': CHR2_PERICOPES,
  'Ezra': EZRA_PERICOPES, 'Nehemiah': NEHEMIAH_PERICOPES, 'Esther': ESTHER_PERICOPES,
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
  console.log(`\n✅ ${count}/12 books imported\n`);
})().catch(console.error);
