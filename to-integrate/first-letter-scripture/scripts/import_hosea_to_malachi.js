#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { HOSEA_PERICOPES } from './pericopes/28_hosea.js';
import { JOEL_PERICOPES } from './pericopes/29_joel.js';
import { AMOS_PERICOPES } from './pericopes/30_amos.js';
import { OBADIAH_PERICOPES } from './pericopes/31_obadiah.js';
import { JONAH_PERICOPES } from './pericopes/32_jonah.js';
import { MICAH_PERICOPES } from './pericopes/33_micah.js';
import { NAHUM_PERICOPES } from './pericopes/34_nahum.js';
import { HABAKKUK_PERICOPES } from './pericopes/35_habakkuk.js';
import { ZEPHANIAH_PERICOPES } from './pericopes/36_zephaniah.js';
import { HAGGAI_PERICOPES } from './pericopes/37_haggai.js';
import { ZECHARIAH_PERICOPES } from './pericopes/38_zechariah.js';
import { MALACHI_PERICOPES } from './pericopes/39_malachi.js';

dotenv.config();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error('No Supabase key');

const supabase = createClient(process.env.VITE_SUPABASE_URL, key);
const BOOKS = {
  'Hosea': HOSEA_PERICOPES,
  'Joel': JOEL_PERICOPES,
  'Amos': AMOS_PERICOPES,
  'Obadiah': OBADIAH_PERICOPES,
  'Jonah': JONAH_PERICOPES,
  'Micah': MICAH_PERICOPES,
  'Nahum': NAHUM_PERICOPES,
  'Habakkuk': HABAKKUK_PERICOPES,
  'Zephaniah': ZEPHANIAH_PERICOPES,
  'Haggai': HAGGAI_PERICOPES,
  'Zechariah': ZECHARIAH_PERICOPES,
  'Malachi': MALACHI_PERICOPES,
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
