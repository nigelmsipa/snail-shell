#!/usr/bin/env node
/**
 * Auto-generate pericopes for all 66 Bible books from DB verses
 * - Targets 6-12 verses per pericope (merges tail orphans)
 * - Creates files under scripts/pericopes_generated matching existing naming
 * - Titles are short phrases from the first verse (<= 8 words), fallback to vX-Y
 *
 * Requires:
 *  - VITE_SUPABASE_URL
 *  - VITE_SUPABASE_PUBLISHABLE_KEY (read-only) OR SUPABASE_SERVICE_ROLE_KEY
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or key (VITE_SUPABASE_PUBLISHABLE_KEY / SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OUT_DIR = path.join(__dirname, 'pericopes');

// Map full book names to exported constant names used by importer
const CONST_NAME = {
  'Genesis': 'GENESIS_PERICOPES',
  'Exodus': 'EXODUS_PERICOPES',
  'Leviticus': 'LEVITICUS_PERICOPES',
  'Numbers': 'NUMBERS_PERICOPES',
  'Deuteronomy': 'DEUTERONOMY_PERICOPES',
  'Joshua': 'JOSHUA_PERICOPES',
  'Judges': 'JUDGES_PERICOPES',
  'Ruth': 'RUTH_PERICOPES',
  '1 Samuel': 'SAMUEL1_PERICOPES',
  '2 Samuel': 'SAMUEL2_PERICOPES',
  '1 Kings': 'KINGS1_PERICOPES',
  '2 Kings': 'KINGS2_PERICOPES',
  '1 Chronicles': 'CHRONICLES1_PERICOPES',
  '2 Chronicles': 'CHRONICLES2_PERICOPES',
  'Ezra': 'EZRA_PERICOPES',
  'Nehemiah': 'NEHEMIAH_PERICOPES',
  'Esther': 'ESTHER_PERICOPES',
  'Job': 'JOB_PERICOPES',
  'Psalms': 'PSALMS_PERICOPES',
  'Proverbs': 'PROVERBS_PERICOPES',
  'Ecclesiastes': 'ECCLESIASTES_PERICOPES',
  'Song of Solomon': 'SONGOFSOL_PERICOPES',
  'Isaiah': 'ISAIAH_PERICOPES',
  'Jeremiah': 'JEREMIAH_PERICOPES',
  'Lamentations': 'LAMENTATIONS_PERICOPES',
  'Ezekiel': 'EZEKIEL_PERICOPES',
  'Daniel': 'DANIEL_PERICOPES',
  'Hosea': 'HOSEA_PERICOPES',
  'Joel': 'JOEL_PERICOPES',
  'Amos': 'AMOS_PERICOPES',
  'Obadiah': 'OBADIAH_PERICOPES',
  'Jonah': 'JONAH_PERICOPES',
  'Micah': 'MICAH_PERICOPES',
  'Nahum': 'NAHUM_PERICOPES',
  'Habakkuk': 'HABAKKUK_PERICOPES',
  'Zephaniah': 'ZEPHANIAH_PERICOPES',
  'Haggai': 'HAGGAI_PERICOPES',
  'Zechariah': 'ZECHARIAH_PERICOPES',
  'Malachi': 'MALACHI_PERICOPES',
  'Matthew': 'MATTHEW_PERICOPES',
  'Mark': 'MARK_PERICOPES',
  'Luke': 'LUKE_PERICOPES',
  'John': 'JOHN_PERICOPES',
  'Acts': 'ACTS_PERICOPES',
  'Romans': 'ROMANS_PERICOPES',
  '1 Corinthians': 'CORINTHIANS1_PERICOPES',
  '2 Corinthians': 'CORINTHIANS2_PERICOPES',
  'Galatians': 'GALATIANS_PERICOPES',
  'Ephesians': 'EPHESIANS_PERICOPES',
  'Philippians': 'PHILIPPIANS_PERICOPES',
  'Colossians': 'COLOSSIANS_PERICOPES',
  '1 Thessalonians': 'THESSALONIANS1_PERICOPES',
  '2 Thessalonians': 'THESSALONIANS2_PERICOPES',
  '1 Timothy': 'TIMOTHY1_PERICOPES',
  '2 Timothy': 'TIMOTHY2_PERICOPES',
  'Titus': 'TITUS_PERICOPES',
  'Philemon': 'PHILEMON_PERICOPES',
  'Hebrews': 'HEBREWS_PERICOPES',
  'James': 'JAMES_PERICOPES',
  '1 Peter': 'PETER1_PERICOPES',
  '2 Peter': 'PETER2_PERICOPES',
  '1 John': 'JOHN1_PERICOPES',
  '2 John': 'JOHN2_PERICOPES',
  '3 John': 'JOHN3_PERICOPES',
  'Jude': 'JUDE_PERICOPES',
  'Revelation': 'REVELATION_PERICOPES',
};

// Map book names to file slug used in existing repo
const FILE_SLUG = {
  'Genesis': 'genesis',
  'Exodus': 'exodus',
  'Leviticus': 'leviticus',
  'Numbers': 'numbers',
  'Deuteronomy': 'deuteronomy',
  'Joshua': 'joshua',
  'Judges': 'judges',
  'Ruth': 'ruth',
  '1 Samuel': '1samuel',
  '2 Samuel': '2samuel',
  '1 Kings': '1kings',
  '2 Kings': '2kings',
  '1 Chronicles': '1chronicles',
  '2 Chronicles': '2chronicles',
  'Ezra': 'ezra',
  'Nehemiah': 'nehemiah',
  'Esther': 'esther',
  'Job': 'job',
  'Psalms': 'psalms',
  'Proverbs': 'proverbs',
  'Ecclesiastes': 'ecclesiastes',
  'Song of Solomon': 'songofsol',
  'Isaiah': 'isaiah',
  'Jeremiah': 'jeremiah',
  'Lamentations': 'lamentations',
  'Ezekiel': 'ezekiel',
  'Daniel': 'daniel',
  'Hosea': 'hosea',
  'Joel': 'joel',
  'Amos': 'amos',
  'Obadiah': 'obadiah',
  'Jonah': 'jonah',
  'Micah': 'micah',
  'Nahum': 'nahum',
  'Habakkuk': 'habakkuk',
  'Zephaniah': 'zephaniah',
  'Haggai': 'haggai',
  'Zechariah': 'zechariah',
  'Malachi': 'malachi',
  'Matthew': 'matthew',
  'Mark': 'mark',
  'Luke': 'luke',
  'John': 'john',
  'Acts': 'acts',
  'Romans': 'romans',
  '1 Corinthians': '1corinthians',
  '2 Corinthians': '2corinthians',
  'Galatians': 'galatians',
  'Ephesians': 'ephesians',
  'Philippians': 'philippians',
  'Colossians': 'colossians',
  '1 Thessalonians': '1thessalonians',
  '2 Thessalonians': '2thessalonians',
  '1 Timothy': '1timothy',
  '2 Timothy': '2timothy',
  'Titus': 'titus',
  'Philemon': 'philemon',
  'Hebrews': 'hebrews',
  'James': 'james',
  '1 Peter': '1peter',
  '2 Peter': '2peter',
  '1 John': '1john',
  '2 John': '2john',
  '3 John': '3john',
  'Jude': 'jude',
  'Revelation': 'revelation',
};

const STOPWORDS = new Set(['the','and','of','to','in','that','a','for','with','is','on','as','by','be','he','she','it','they','we','you','i','his','her','their','our','your','from','was','were','are','this','these','those','which','who','whom','shall']);

function titleCase(s) {
  return s.replace(/\S+/g, w => w[0] ? w[0].toUpperCase() + w.slice(1) : w);
}

function makeTitle(firstVerseText, start, end) {
  if (!firstVerseText) return `v${start}-${end}`;
  const words = firstVerseText
    .replace(/[^a-zA-Z\s']/g, '')
    .split(/\s+/)
    .filter(Boolean);
  const picked = [];
  for (const w of words) {
    const lw = w.toLowerCase();
    if (!STOPWORDS.has(lw)) picked.push(w);
    if (picked.length >= 6) break;
  }
  const base = picked.length ? picked.join(' ') : words.slice(0, 6).join(' ');
  const t = titleCase(base).trim();
  const capped = t.split(/\s+/).slice(0, 8).join(' ');
  return capped || `v${start}-${end}`;
}

function segmentRanges(total, minSize = 6, maxSize = 12) {
  const ranges = [];
  let start = 1;
  while (start <= total) {
    const remaining = total - start + 1;
    if (remaining <= maxSize && remaining >= minSize) {
      ranges.push([start, total]);
      break;
    }
    if (remaining < minSize) {
      // Merge tail into previous
      if (ranges.length > 0) {
        ranges[ranges.length - 1][1] = total;
      } else {
        ranges.push([start, total]);
      }
      break;
    }
    const size = maxSize;
    const end = start + size - 1;
    ranges.push([start, end]);
    start = end + 1;
  }
  return ranges;
}

async function getActiveVersionId() {
  // Prefer KJV; else first active; else any
  let { data, error } = await supabase
    .from('bible_versions')
    .select('id, abbreviation, is_active')
    .eq('abbreviation', 'KJV')
    .maybeSingle();
  if (data?.id) return data.id;
  ({ data } = await supabase.from('bible_versions').select('id').eq('is_active', true).limit(1).single());
  if (data?.id) return data.id;
  ({ data } = await supabase.from('bible_versions').select('id').limit(1).single());
  return data?.id || null;
}

async function fetchMaxVerse(bookId, chapter) {
  const { data, error } = await supabase
    .from('bible_verses')
    .select('verse')
    .eq('book_id', bookId)
    .eq('chapter', chapter)
    .order('verse', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data && data.length ? data[0].verse : 0;
}

async function fetchVerseText(versionId, bookId, chapter, verse) {
  const { data, error } = await supabase
    .from('bible_verses')
    .select('text')
    .eq('version_id', versionId)
    .eq('book_id', bookId)
    .eq('chapter', chapter)
    .eq('verse', verse)
    .maybeSingle();
  if (error) return '';
  return data?.text || '';
}

async function main() {
  const versionId = await getActiveVersionId();
  if (!versionId) {
    console.error('No bible version found in database');
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

  const { data: books, error: booksError } = await supabase
    .from('bible_books')
    .select('id, name, book_number, total_chapters')
    .order('book_number');
  if (booksError) {
    console.error('Failed to fetch books', booksError.message);
    process.exit(1);
  }

  for (const book of books) {
    const constName = CONST_NAME[book.name];
    const slug = FILE_SLUG[book.name];
    if (!constName || !slug) {
      console.warn('Skipping unknown book mapping:', book.name);
      continue;
    }
    const fileNum = String(book.book_number).padStart(2, '0');
    const outPath = path.join(OUT_DIR, `${fileNum}_${slug}.js`);

    const pericopes = [];
    for (let chapter = 1; chapter <= book.total_chapters; chapter++) {
      const maxVerse = await fetchMaxVerse(book.id, chapter);
      if (!maxVerse || maxVerse <= 0) continue;
      const ranges = segmentRanges(maxVerse, 6, 12);
      for (const [start, end] of ranges) {
        const firstText = await fetchVerseText(versionId, book.id, chapter, start);
        const name = makeTitle(firstText, start, end);
        pericopes.push({ chapter, verse_start: start, verse_end: end, name });
      }
    }

    const header = `// Auto-generated pericopes for ${book.name} (book ${book.book_number})\n` +
      `// Generated by scripts/generate_pericopes_from_db.js\n`;
    const exportLines = pericopes.map(p => `  { chapter: ${p.chapter}, verse_start: ${p.verse_start}, verse_end: ${p.verse_end}, name: ${JSON.stringify(p.name)} }`).join(',\n');
    const content = `${header}\nexport const ${constName} = [\n${exportLines}\n];\n`;
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`✓ Wrote ${outPath} (${pericopes.length} pericopes)`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

