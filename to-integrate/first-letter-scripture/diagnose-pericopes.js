#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GENESIS_PERICOPES } from './scripts/pericopes/01_genesis.js';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function diagnose() {
  console.log('📊 PERICOPE DIAGNOSTIC\n');
  console.log('='.repeat(60));

  // Check what's in the file
  console.log('\nGenesis file contains:', GENESIS_PERICOPES.length, 'pericopes');

  // Check what's in the database
  const { data: books } = await supabase
    .from('bible_books')
    .select('id, name')
    .eq('name', 'Genesis');

  if (!books || books.length === 0) {
    console.log('Genesis book not found in database');
    return;
  }

  const { data: dbPericopes } = await supabase
    .from('bible_pericopes')
    .select('*')
    .eq('book_id', books[0].id)
    .order('display_order', { ascending: true });

  console.log('Database contains:', dbPericopes.length, 'pericopes');

  if (dbPericopes.length !== GENESIS_PERICOPES.length) {
    console.log('\n⚠️  MISMATCH! File has', GENESIS_PERICOPES.length, 'but database has', dbPericopes.length);
  }

  // Check if they're truncated
  console.log('\nFirst 5 file pericopes:');
  GENESIS_PERICOPES.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i+1}. Ch ${p.chapter}:${p.verse_start}-${p.verse_end} - ${p.name}`);
  });

  console.log('\nFirst 5 database pericopes:');
  dbPericopes.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i+1}. Ch ${p.chapter}:${p.verse_start}-${p.verse_end} - ${p.name}`);
  });

  // Calculate metrics
  const fileVersesTotal = GENESIS_PERICOPES.reduce((sum, p) => sum + (p.verse_end - p.verse_start + 1), 0);
  const dbVersesTotal = dbPericopes.reduce((sum, p) => sum + (p.verse_end - p.verse_start + 1), 0);

  console.log('\n' + '='.repeat(60));
  console.log('Metrics:');
  console.log(`  File: ${GENESIS_PERICOPES.length} pericopes, ${fileVersesTotal} verses (avg ${(fileVersesTotal / GENESIS_PERICOPES.length).toFixed(1)} v/p)`);
  console.log(`  DB:   ${dbPericopes.length} pericopes, ${dbVersesTotal} verses (avg ${(dbVersesTotal / dbPericopes.length).toFixed(1)} v/p)`);
}

diagnose();
