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

  // Get all Genesis pericopes
  const { data: allPericopesRaw, count: totalCount } = await supabase
    .from('bible_pericopes')
    .select('id, book_id, chapter', { count: 'exact' })
    .eq('book_id', genesisBook.id);

  console.log('Total Genesis pericopes:', totalCount);

  if (allPericopesRaw && allPericopesRaw.length > 0) {
    console.log('First 10:');
    allPericopesRaw.slice(0, 10).forEach((p, i) => {
      console.log(`  ${i+1}. Ch ${p.chapter}`);
    });

    // Count by chapter
    const byChapter = {};
    allPericopesRaw.forEach(p => {
      byChapter[p.chapter] = (byChapter[p.chapter] || 0) + 1;
    });

    console.log('\nPericopes per chapter:');
    Object.keys(byChapter).sort((a,b) => parseInt(a) - parseInt(b)).forEach(ch => {
      console.log(`  Chapter ${ch}: ${byChapter[ch]}`);
    });
  }
})();
