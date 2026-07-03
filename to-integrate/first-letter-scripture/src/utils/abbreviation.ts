/**
 * Generate first-letter abbreviation from verse text
 * Used for memorization practice in the app
 */

/**
 * Converts a Bible verse to its first-letter abbreviation
 * @param text - The full verse text
 * @returns Abbreviated version with first letters and punctuation preserved
 * 
 * @example
 * abbreviateVerse("In the beginning God created the heavens and the earth.")
 * // Returns: "I t b G c t h a t e."
 */
export function abbreviateVerse(text: string): string {
  if (!text) return '';
  
  // Split into words while preserving punctuation
  const words = text.split(/(\s+|[.,;:!?'"—-])/);
  
  let result = '';
  
  for (const part of words) {
    if (!part) continue;
    
    // Check if this is a word (starts with letter/number)
    if (/^[A-Za-z0-9]/.test(part)) {
      // Take first character, preserve original case
      result += part[0];
    } else if (/^[.,;:!?'"—-]/.test(part)) {
      // It's punctuation - add it directly
      result += part;
    } else if (/^\s+$/.test(part)) {
      // It's whitespace - add a single space
      result += ' ';
    }
  }
  
  // Clean up spacing around punctuation
  return result
    .replace(/\s+([.,;:!?'"])/g, '$1') // Remove space before punctuation
    .replace(/([.,;:!?'"])\s*(?=[A-Za-z0-9])/g, '$1 ') // Add space after punctuation before letters
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}

/**
 * Alternative simpler version that just takes first letter of each word
 * @param text - The full verse text
 * @returns Simple abbreviation (uppercase first letters with spaces)
 */
export function simpleAbbreviate(text: string): string {
  if (!text) return '';
  
  // Split by whitespace and take first character of each word
  return text
    .split(/\s+/)
    .map(word => {
      // Find first alphanumeric character
      const match = word.match(/\w/);
      return match ? match[0] : ''; // Preserve original case
    })
    .filter(letter => letter) // Remove empty strings
    .join(' ');
}

/**
 * Checks if a user's input matches the expected abbreviation
 * Allows for some flexibility in matching
 * @param userInput - What the user typed
 * @param expected - The correct abbreviation
 * @returns true if the input matches (case-insensitive, ignoring extra spaces)
 */
export function checkAbbreviation(userInput: string, expected: string): boolean {
  // Normalize both strings: uppercase, single spaces, trimmed
  const normalizeString = (str: string) => 
    str.toUpperCase().replace(/\s+/g, ' ').trim();
  
  return normalizeString(userInput) === normalizeString(expected);
}

/**
 * Gets the progress percentage for partial input
 * @param userInput - What the user has typed so far
 * @param expected - The full correct abbreviation
 * @returns Percentage of correct input (0-100)
 */
export function getProgress(userInput: string, expected: string): number {
  const cleanInput = userInput.toUpperCase().replace(/\s+/g, '');
  const cleanExpected = expected.toUpperCase().replace(/\s+/g, '');
  
  if (!cleanExpected) return 0;
  
  let correct = 0;
  for (let i = 0; i < Math.min(cleanInput.length, cleanExpected.length); i++) {
    if (cleanInput[i] === cleanExpected[i]) {
      correct++;
    } else {
      break; // Stop at first mismatch
    }
  }
  
  return Math.round((correct / cleanExpected.length) * 100);
}
