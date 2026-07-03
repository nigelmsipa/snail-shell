import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

// Input validation helpers
const VALID_TESTAMENTS = ['OT', 'NT'];
const MAX_BOOK_LENGTH = 50;
const MAX_VERSION_LENGTH = 10;

function sanitizeBookName(book: string): string | null {
  if (!book || book.length > MAX_BOOK_LENGTH) return null;
  // Only allow alphanumeric, spaces, and common punctuation
  if (!/^[a-zA-Z0-9\s]+$/.test(book)) return null;
  return book.trim();
}

function sanitizeVersion(version: string): string | null {
  if (!version || version.length > MAX_VERSION_LENGTH) return null;
  // Only allow alphanumeric
  if (!/^[a-zA-Z0-9]+$/.test(version)) return null;
  return version.trim().toUpperCase();
}

function isValidTestament(testament: string): boolean {
  return VALID_TESTAMENTS.includes(testament.toUpperCase());
}

function isValidChapter(chapter: string): boolean {
  const num = parseInt(chapter, 10);
  return !isNaN(num) && num > 0 && num <= 150; // Max chapters in any book is 150 (Psalms)
}

function isValidVerse(verse: string): boolean {
  // Single verse: "16" or range: "16-18"
  if (verse.includes('-')) {
    const parts = verse.split('-');
    if (parts.length !== 2) return false;
    const start = parseInt(parts[0].trim(), 10);
    const end = parseInt(parts[1].trim(), 10);
    return !isNaN(start) && !isNaN(end) && start > 0 && end > 0 && start <= end && end <= 200;
  }
  const num = parseInt(verse, 10);
  return !isNaN(num) && num > 0 && num <= 200;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    // Path format: /bible-api/{endpoint}
    const endpoint = pathParts[1] || '';

    const supabase = createClient(supabaseUrl, supabaseKey);

    // GET /versions - List all active Bible versions
    if (endpoint === 'versions') {
      const { data, error } = await supabase
        .from('bible_versions')
        .select('abbreviation, name, language, copyright_info')
        .eq('is_active', true)
        .order('abbreviation');

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        count: data.length,
        data: data
      }), { headers: corsHeaders });
    }

    // GET /books - List all 66 books
    if (endpoint === 'books') {
      const testament = url.searchParams.get('testament'); // optional: OT or NT
      
      let query = supabase
        .from('bible_books')
        .select('name, abbreviation, testament, book_number, total_chapters')
        .order('book_number');

      if (testament) {
        // Validate testament parameter
        if (!isValidTestament(testament)) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid testament parameter. Must be OT or NT.',
            valid_values: VALID_TESTAMENTS
          }), { status: 400, headers: corsHeaders });
        }
        query = query.eq('testament', testament.toUpperCase());
      }

      const { data, error } = await query;
      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        count: data.length,
        data: data
      }), { headers: corsHeaders });
    }

    // GET /verses - Fetch verses with query params
    if (endpoint === 'verses') {
      const bookParam = url.searchParams.get('book');
      const chapterParam = url.searchParams.get('chapter');
      const versionParam = url.searchParams.get('version') || 'KJV';
      const verseParam = url.searchParams.get('verse'); // optional: "16" or "16-18"
      const clean = url.searchParams.get('clean') === 'true'; // optional: strip brackets

      // Validate required params
      if (!bookParam || !chapterParam) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required parameters: book and chapter are required',
          usage: '/verses?book=John&chapter=3&version=KJV&verse=16'
        }), { status: 400, headers: corsHeaders });
      }

      // Sanitize book name
      const book = sanitizeBookName(bookParam);
      if (!book) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid book parameter. Must be alphanumeric and less than 50 characters.'
        }), { status: 400, headers: corsHeaders });
      }

      // Validate chapter
      if (!isValidChapter(chapterParam)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid chapter parameter. Must be a positive integer.'
        }), { status: 400, headers: corsHeaders });
      }
      const chapter = parseInt(chapterParam, 10);

      // Sanitize version
      const version = sanitizeVersion(versionParam);
      if (!version) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid version parameter. Must be alphanumeric.',
          available_versions: ['KJV', 'BSB', 'MSV', 'WEB']
        }), { status: 400, headers: corsHeaders });
      }

      // Validate verse if provided
      if (verseParam && !isValidVerse(verseParam)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid verse parameter. Must be a number or range (e.g., "16" or "16-18").'
        }), { status: 400, headers: corsHeaders });
      }

      // Get all books first and filter in application code (safer than using .or with user input)
      const { data: allBooks, error: booksError } = await supabase
        .from('bible_books')
        .select('id, name, abbreviation');

      if (booksError) throw booksError;

      // Find matching book (case-insensitive)
      const bookLower = book.toLowerCase();
      const bookData = allBooks?.find(b => 
        b.name.toLowerCase() === bookLower || 
        b.abbreviation.toLowerCase() === bookLower
      );

      if (!bookData) {
        return new Response(JSON.stringify({
          success: false,
          error: `Book not found: ${book}`
        }), { status: 404, headers: corsHeaders });
      }

      // Get version using exact match with validated input
      const { data: versionData, error: versionError } = await supabase
        .from('bible_versions')
        .select('id, abbreviation, name')
        .eq('abbreviation', version)
        .maybeSingle();

      if (versionError) throw versionError;
      if (!versionData) {
        return new Response(JSON.stringify({
          success: false,
          error: `Version not found: ${version}`,
          available_versions: ['KJV', 'BSB', 'MSV', 'WEB']
        }), { status: 404, headers: corsHeaders });
      }

      // Build verse query with validated, typed parameters
      let query = supabase
        .from('bible_verses')
        .select('verse, text')
        .eq('book_id', bookData.id)
        .eq('version_id', versionData.id)
        .eq('chapter', chapter)
        .order('verse');

      // Handle verse range with validated input
      if (verseParam) {
        if (verseParam.includes('-')) {
          const [start, end] = verseParam.split('-').map(v => parseInt(v.trim(), 10));
          query = query.gte('verse', start).lte('verse', end);
        } else {
          query = query.eq('verse', parseInt(verseParam, 10));
        }
      }

      const { data: verses, error: versesError } = await query;
      if (versesError) throw versesError;

      if (!verses || verses.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: `No verses found for ${bookData.name} ${chapter}${verseParam ? ':' + verseParam : ''}`
        }), { status: 404, headers: corsHeaders });
      }

      // Optionally clean bracket notation (e.g., "[was]" -> "was")
      const processedVerses = clean 
        ? verses.map(v => ({ ...v, text: v.text.replace(/\[|\]/g, '') }))
        : verses;

      return new Response(JSON.stringify({
        success: true,
        data: {
          book: bookData.name,
          chapter: chapter,
          version: versionData.abbreviation,
          version_name: versionData.name,
          verse_count: processedVerses.length,
          verses: processedVerses
        }
      }), { headers: corsHeaders });
    }

    // GET /pericopes - Fetch pericopes (passage divisions)
    if (endpoint === 'pericopes') {
      const bookParam = url.searchParams.get('book');
      const chapterParam = url.searchParams.get('chapter');

      // Start with base query
      let query = supabase
        .from('bible_pericopes')
        .select(`
          name,
          chapter,
          verse_start,
          verse_end,
          verse_count,
          subtitle,
          theme,
          book:bible_books!inner(name, abbreviation)
        `)
        .order('display_order');

      // If book is specified, validate and filter
      if (bookParam) {
        const book = sanitizeBookName(bookParam);
        if (!book) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid book parameter. Must be alphanumeric and less than 50 characters.'
          }), { status: 400, headers: corsHeaders });
        }

        // Get book ID first to avoid string interpolation in query
        const { data: allBooks, error: booksError } = await supabase
          .from('bible_books')
          .select('id, name, abbreviation');

        if (booksError) throw booksError;

        const bookLower = book.toLowerCase();
        const bookData = allBooks?.find(b => 
          b.name.toLowerCase() === bookLower || 
          b.abbreviation.toLowerCase() === bookLower
        );

        if (!bookData) {
          return new Response(JSON.stringify({
            success: false,
            error: `Book not found: ${book}`
          }), { status: 404, headers: corsHeaders });
        }

        // Filter by book_id (safe, uses UUID)
        query = query.eq('book_id', bookData.id);
      }

      if (chapterParam) {
        if (!isValidChapter(chapterParam)) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid chapter parameter. Must be a positive integer.'
          }), { status: 400, headers: corsHeaders });
        }
        query = query.eq('chapter', parseInt(chapterParam, 10));
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        count: data.length,
        data: data.map(p => ({
          name: p.name,
          book: (p.book as unknown as { name: string; abbreviation: string }).name,
          chapter: p.chapter,
          verse_start: p.verse_start,
          verse_end: p.verse_end,
          verse_count: p.verse_count,
          subtitle: p.subtitle,
          theme: p.theme
        }))
      }), { headers: corsHeaders });
    }

    // Default: API documentation
    return new Response(JSON.stringify({
      success: true,
      api: 'Wolf & Word Bible API',
      version: '1.0.0',
      endpoints: {
        versions: {
          method: 'GET',
          path: '/versions',
          description: 'List all available Bible versions',
          example: '/versions'
        },
        books: {
          method: 'GET',
          path: '/books',
          description: 'List all 66 books of the Bible',
          params: {
            testament: 'optional - Filter by OT or NT'
          },
          example: '/books?testament=NT'
        },
        verses: {
          method: 'GET',
          path: '/verses',
          description: 'Fetch verses from a specific chapter',
          params: {
            book: 'required - Book name or abbreviation',
            chapter: 'required - Chapter number',
            version: 'optional - Version abbreviation (default: KJV)',
            verse: 'optional - Single verse or range (e.g., "16" or "16-18")',
            clean: 'optional - Strip bracket notation from text (default: false)'
          },
          examples: [
            '/verses?book=John&chapter=3&verse=16',
            '/verses?book=Gen&chapter=1&version=BSB',
            '/verses?book=Romans&chapter=8&verse=28-39',
            '/verses?book=Joshua&chapter=14&verse=15&clean=true'
          ]
        },
        pericopes: {
          method: 'GET',
          path: '/pericopes',
          description: 'Fetch passage divisions (pericopes)',
          params: {
            book: 'optional - Filter by book',
            chapter: 'optional - Filter by chapter'
          },
          example: '/pericopes?book=John&chapter=3'
        }
      },
      available_versions: ['KJV', 'BSB', 'MSV', 'WEB'],
      stats: {
        books: 66,
        verses: '124,000+',
        versions: 4
      }
    }), { headers: corsHeaders });

  } catch (error: unknown) {
    console.error('Bible API Error:', error);
    // Don't expose internal error details to clients
    return new Response(JSON.stringify({
      success: false,
      error: 'An error occurred processing your request'
    }), { status: 500, headers: corsHeaders });
  }
});
