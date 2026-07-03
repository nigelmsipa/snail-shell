#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required to delete pericopes.');
}
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SERVICE_KEY
);

async function clearGenesis() {
  const { data: book, error: bookError } = await supabase
    .from('bible_books')
    .select('id')
    .eq('name', 'Genesis')
    .single();

  if (bookError) {
    console.error('❌ Error finding Genesis:', bookError.message);
    process.exit(1);
  }

  const { error: deleteError } = await supabase
    .from('bible_pericopes')
    .delete()
    .eq('book_id', book.id);

  if (deleteError) {
    console.error('❌ Error deleting Genesis pericopes:', deleteError.message);
    process.exit(1);
  }

  console.log('✅ Genesis pericopes cleared');
}

clearGenesis();
