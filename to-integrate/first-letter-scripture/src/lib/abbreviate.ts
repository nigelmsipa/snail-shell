/**
 * Dynamically generate abbreviated text from full verse text
 * Algorithm:
 * 1. Split by whitespace
 * 2. Extract first letter of each word (uppercase)
 * 3. Preserve trailing punctuation (.,;:?!)
 * 4. Handle brackets: [was] -> W
 */
export function abbreviateText(fullText: string): string {
  return fullText
    .split(/\s+/)
    .map(word => {
      // First, remove all square brackets
      const withoutBrackets = word.replace(/[\[\]]/g, '');
      
      // Remove leading/trailing non-word chars
      const cleaned = withoutBrackets.replace(/^[^\w]+|[^\w]+$/g, '');
      if (cleaned.length === 0) return '';
      
      // Get first letter (uppercase)
      const firstLetter = cleaned[0].toUpperCase();
      
      // Extract trailing punctuation (excluding brackets)
      const punctuation = withoutBrackets.match(/[.,;:?!)"']+$/)?.[0] || '';
      
      return firstLetter + punctuation;
    })
    .filter(token => token.length > 0)
    .join(' ');
}

/**
 * Tokenize full text into words with punctuation
 * Returns: [{word: "In", punctuation: ""}, {word: "beginning", punctuation: "."}, ...]
 */
export function tokenizeVerse(fullText: string) {
  return fullText.split(/\s+/).map(word => {
    // First, remove all square brackets
    const withoutBrackets = word.replace(/[\[\]]/g, '');
    
    // Extract punctuation (excluding brackets)
    const punctuation = withoutBrackets.match(/[.,;:?!)"']+$/)?.[0] || '';
    
    // Clean the word
    const cleanWord = withoutBrackets.replace(/^[^\w]+|[^\w]+$/g, '');
    
    return { word: cleanWord, punctuation };
  });
}

/**
 * Map abbreviated letters to full words for letter-by-letter hover
 */
export function mapLettersToWords(fullText: string) {
  const tokens = tokenizeVerse(fullText);
  return tokens.map((token, idx) => ({
    letter: token.word[0]?.toUpperCase() || '',
    word: token.word,
    punctuation: token.punctuation,
    index: idx
  }));
}
