#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ROMANS_PERICOPES } from './pericopes/45_romans.js';
import { CORINTHIANS1_PERICOPES } from './pericopes/46_1corinthians.js';
import { CORINTHIANS2_PERICOPES } from './pericopes/47_2corinthians.js';
import { GALATIANS_PERICOPES } from './pericopes/48_galatians.js';
import { EPHESIANS_PERICOPES } from './pericopes/49_ephesians.js';
import { PHILIPPIANS_PERICOPES } from './pericopes/50_philippians.js';
import { COLOSSIANS_PERICOPES } from './pericopes/51_colossians.js';
import { THESSALONIANS1_PERICOPES } from './pericopes/52_1thessalonians.js';
import { THESSALONIANS2_PERICOPES } from './pericopes/53_2thessalonians.js';
import { TIMOTHY1_PERICOPES } from './pericopes/54_1timothy.js';
import { TIMOTHY2_PERICOPES } from './pericopes/55_2timothy.js';
import { TITUS_PERICOPES } from './pericopes/56_titus.js';
import { PHILEMON_PERICOPES } from './pericopes/57_philemon.js';
import { HEBREWS_PERICOPES } from './pericopes/58_hebrews.js';

dotenv.config();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) throw new Error('No Supabase key');

const supabase = createClient(process.env.VITE_SUPABASE_URL, key);
const BOOKS = {
  'Romans': ROMANS_PERICOPES,
  '1 Corinthians': CORINTHIANS1_PERICOPES,
  '2 Corinthians': CORINTHIANS2_PERICOPES,
  'Galatians': GALATIANS_PERICOPES,
  'Ephesians': EPHESIANS_PERICOPES,
  'Philippians': PHILIPPIANS_PERICOPES,
  'Colossians': COLOSSIANS_PERICOPES,
  '1 Thessalonians': THESSALONIANS1_PERICOPES,
  '2 Thessalonians': THESSALONIANS2_PERICOPES,
  '1 Timothy': TIMOTHY1_PERICOPES,
  '2 Timothy': TIMOTHY2_PERICOPES,
  'Titus': TITUS_PERICOPES,
  'Philemon': PHILEMON_PERICOPES,
  'Hebrews': HEBREWS_PERICOPES,
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
  console.log(`\n✅ ${count}/14 books imported\n`);
})().catch(console.error);
