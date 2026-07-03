/**
 * Text utility functions for cleaning and processing Bible verse text
 */

/**
 * Strips bracket characters [ and ] from text while keeping the words inside.
 * KJV uses brackets to indicate translator-added words for clarity.
 * 
 * @example
 * cleanVerseText("the name [was] Kirjatharba") // => "the name was Kirjatharba"
 * cleanVerseText("And [it was] so") // => "And it was so"
 */
export function cleanVerseText(text: string): string {
  if (!text) return '';
  return text.replace(/\[|\]/g, '');
}
