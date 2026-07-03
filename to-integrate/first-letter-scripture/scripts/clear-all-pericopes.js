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

async function clearAllPericopes() {
  console.log('🗑️  Clearing all pericopes from database...');
  
  try {
    const { error, count } = await supabase
      .from('bible_pericopes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows (neq always true)
    
    if (error) {
      console.error('❌ Error clearing pericopes:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ Cleared all pericopes from database`);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

clearAllPericopes();
