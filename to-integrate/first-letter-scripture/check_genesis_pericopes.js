import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

(async () => {
  // Get Genesis book ID
  const { data: genesisBook } = await supabase
    .from('bible_books')
    .select('id, name')
    .eq('name', 'Genesis')
    .single();

  console.log('Genesis ID:', genesisBook?.id);

  // Count total pericopes for Genesis
  const { count: totalCount } = await supabase
    .from('bible_pericopes')
    .select('*', { count: 'exact', head: true })
    .eq('book_id', genesisBook.id);

  console.log('Total Genesis pericopes in database:', totalCount);

  // Get first 5 pericopes
  const { data: firstPericopes } = await supabase
    .from('bible_pericopes')
    .select('*')
    .eq('book_id', genesisBook.id)
    .order('chapter', { ascending: true })
    .order('display_order', { ascending: true })
    .limit(5);

  if (firstPericopes && firstPericopes.length > 0) {
    console.log('\nFirst 5 pericopes:');
    firstPericopes.forEach(p => {
      console.log(`  Ch ${p.chapter}, v${p.verse_start}-${p.verse_end}: "${p.name}"`);
    });
  } else {
    console.log('\n❌ No pericopes found in database!');
  }
})();
