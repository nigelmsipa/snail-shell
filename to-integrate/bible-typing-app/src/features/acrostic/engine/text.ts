export function normalizeForCompare(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export interface Token {
  raw: string;
  core: string; // word without surrounding punctuation
  lead: string; // leading punctuation
  trail: string; // trailing punctuation
}

const PUNCT = `.,;:!?"'()[]{}<>`;

export function tokenize(text: string): Token[] {
  const toks: Token[] = [];
  for (const raw of text.split(/\s+/)) {
    let lead = "";
    let trail = "";
    let core = raw;
    // strip leading punctuation
    while (core && PUNCT.includes(core[0])) {
      lead += core[0];
      core = core.slice(1);
    }
    // strip trailing punctuation
    while (core && PUNCT.includes(core[core.length - 1])) {
      trail = core[core.length - 1] + trail;
      core = core.slice(0, -1);
    }
    toks.push({ raw, core, lead, trail });
  }
  return toks;
}

export function firstLettersMask(tokens: Token[], opts?: { keepPunct?: boolean; placeholder?: string; noSpaces?: boolean }): string {
  const keepPunct = opts?.keepPunct ?? false;
  const placeholder = opts?.placeholder ?? ""; // e.g., '_' to show underscores after first letter
  const noSpaces = opts?.noSpaces ?? false;
  return tokens
    .map((t) => {
      const first = t.core ? t.core[0] : "";
      const rest = placeholder && t.core.length > 1 ? placeholder.repeat(t.core.length - 1) : "";
      const word = first + rest;
      return keepPunct ? `${t.lead}${word}${t.trail}` : word;
    })
    .join(noSpaces ? "" : " ");
}

export interface ComparisonResult {
  perChar: boolean[];
  perWord: boolean[];
  accuracy: number;
}

export function compareTypedToTarget(typed: string, target: string): ComparisonResult {
  const normalizedTyped = normalizeForCompare(typed);
  const normalizedTarget = normalizeForCompare(target);
  
  const perChar: boolean[] = [];
  for (let i = 0; i < normalizedTyped.length; i++) {
    perChar.push(i < normalizedTarget.length && normalizedTyped[i] === normalizedTarget[i]);
  }
  
  const targetTokens = tokenize(normalizedTarget);
  const typedTokens = tokenize(normalizedTyped);
  
  const perWord: boolean[] = [];
  for (let i = 0; i < Math.max(targetTokens.length, typedTokens.length); i++) {
    const targetWord = targetTokens[i]?.core || "";
    const typedWord = typedTokens[i]?.core || "";
    perWord.push(targetWord === typedWord);
  }
  
  const correctChars = perChar.filter(Boolean).length;
  const totalChars = Math.max(normalizedTyped.length, normalizedTarget.length);
  const accuracy = totalChars > 0 ? correctChars / totalChars : 1;
  
  return { perChar, perWord, accuracy };
}

export function wordBoundaries(tokens: Token[]): Array<{ start: number; end: number; word: string }> {
  const boundaries: Array<{ start: number; end: number; word: string }> = [];
  let position = 0;
  
  for (const token of tokens) {
    if (token.core) {
      const start = position + token.lead.length;
      const end = start + token.core.length;
      boundaries.push({ start, end, word: token.core });
    }
    position += token.raw.length + 1; // +1 for space
  }
  
  return boundaries;
}

