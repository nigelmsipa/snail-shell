export const BIBLE_API_BASE = 'https://eamjsthjahxzsqmqjwxi.supabase.co/functions/v1/bible-api';

export const BIBLE_VERSIONS = [
  { abbreviation: 'KJV', name: 'King James Version' },
  { abbreviation: 'BSB', name: 'Berean Standard Bible' },
  { abbreviation: 'MSV', name: 'Modern Standard Version' },
  { abbreviation: 'WEB', name: 'World English Bible' },
] as const;

export type BibleVersion = typeof BIBLE_VERSIONS[number]['abbreviation'];

export const DEFAULT_TEXT = '';

export const OLD_TESTAMENT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
];

export const NEW_TESTAMENT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation',
];

export const PENTATEUCH = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];
export const WISDOM_BOOKS = ['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon'];

export const colorPresets = [
  { name: 'Cream', bgColor: '#FDF6E3', textColor: '#586E75' },
  { name: 'Purple Dream', bgColor: '#2D1B69', textColor: '#F7E98E' },
  { name: 'Deep Blue', bgColor: '#1E3A8A', textColor: '#E5E7EB' },
  { name: 'Forest Green', bgColor: '#064E3B', textColor: '#ECFCCB' },
  { name: 'Classic Dark', bgColor: '#000000', textColor: '#FFFFFF' },
  { name: 'Pure Light', bgColor: '#FFFFFF', textColor: '#1F2937' },
  { name: 'Warm Sepia', bgColor: '#FBF0D9', textColor: '#5E493B' },
  { name: 'Ocean Night', bgColor: '#0F172A', textColor: '#7DD3FC' },
];
