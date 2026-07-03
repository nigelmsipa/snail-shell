/**
 * Convert Torah pericopes from memory-method-bible JSON format
 * to first-letter-scripture JavaScript format
 *
 * Usage: node convert_torah_from_json.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TORAH_BOOKS = {
  'Genesis': 'genesis-base.json',
  'Exodus': 'exodus-base.json',
  'Leviticus': 'leviticus-base.json',
  'Numbers': 'numbers-base.json',
  'Deuteronomy': 'deuteronomy-base.json'
};

const MEMORY_METHOD_BIBLE_PATH = '/home/nigel/memory-method-bible/data/base-structure';
const FIRST_LETTER_SCRIPTURE_PATH = path.join(__dirname, 'pericopes');

function parseReference(reference) {
  // Reference format: "1:1-14" or "1:1-5:32"
  const parts = reference.split('-');
  if (parts.length !== 2) {
    console.error(`Invalid reference format: ${reference}`);
    return null;
  }

  const startParts = parts[0].split(':');
  const endParts = parts[1].split(':');

  const chapter = parseInt(startParts[0]);
  const verse_start = parseInt(startParts[1]);

  // Handle multi-chapter references (e.g., "1:1-5:32")
  const end_chapter = endParts.length > 1 ? parseInt(endParts[0]) : chapter;
  const verse_end = endParts.length > 1 ? parseInt(endParts[1]) : parseInt(endParts[0]);

  return {
    chapter,
    verse_start,
    verse_end,
    is_multiChapter: end_chapter !== chapter
  };
}

function convertBook(bookName) {
  const jsonPath = path.join(MEMORY_METHOD_BIBLE_PATH, TORAH_BOOKS[bookName]);

  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    return null;
  }

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const pericopes = [];
  const multiChapterSkipped = [];

  // Iterate through stories and scenes
  jsonData.stories.forEach(story => {
    story.scenes.forEach(scene => {
      const refParts = parseReference(scene.reference);

      if (!refParts) {
        return;
      }

      if (refParts.is_multiChapter) {
        // Multi-chapter references - skip for now but track them
        multiChapterSkipped.push({
          reference: scene.reference,
          name: scene.scene_name
        });
      } else {
        // Single chapter pericope
        pericopes.push({
          chapter: refParts.chapter,
          verse_start: refParts.verse_start,
          verse_end: refParts.verse_end,
          name: scene.scene_name
        });
      }
    });
  });

  return { pericopes, multiChapterSkipped };
}

function generateJavaScriptFile(bookName, pericopes) {
  const fileNum = Object.keys(TORAH_BOOKS).indexOf(bookName) + 1;
  const paddedNum = String(fileNum).padStart(2, '0');
  const fileName = `${paddedNum}_${bookName.toLowerCase()}.js`;

  let jsContent = `/**
 * ${bookName.toUpperCase()} PERICOPES
 * Converted from memory-method-bible comprehensive research outlines
 * Optimized for memorization: text-driven boundaries, evocative titles
 */

export const ${bookName.toUpperCase()}_PERICOPES = [
`;

  pericopes.forEach((pericope, index) => {
    // Escape single quotes in names
    const escapedName = pericope.name.replace(/'/g, "\\'");
    jsContent += `  { chapter: ${pericope.chapter}, verse_start: ${pericope.verse_start}, verse_end: ${pericope.verse_end}, name: '${escapedName}' }`;

    if (index < pericopes.length - 1) {
      jsContent += ',\n';
    } else {
      jsContent += '\n';
    }
  });

  jsContent += `];\n`;

  return { fileName, jsContent };
}

function main() {
  console.log('Converting Torah pericopes from JSON to JavaScript format...\n');

  Object.entries(TORAH_BOOKS).forEach(([bookName, jsonFile]) => {
    console.log(`Converting ${bookName}...`);

    const result = convertBook(bookName);

    if (!result) {
      console.error(`  ERROR: Could not convert ${bookName}`);
      return;
    }

    const { pericopes, multiChapterSkipped } = result;

    if (pericopes.length === 0) {
      console.error(`  ERROR: No single-chapter pericopes found for ${bookName}`);
      return;
    }

    const { fileName, jsContent } = generateJavaScriptFile(bookName, pericopes);
    const outputPath = path.join(FIRST_LETTER_SCRIPTURE_PATH, fileName);

    fs.writeFileSync(outputPath, jsContent, 'utf8');

    console.log(`  ✓ Converted ${pericopes.length} pericopes`);
    console.log(`  ✓ Wrote to: ${fileName}`);

    if (multiChapterSkipped.length > 0) {
      console.log(`  ⚠ Skipped ${multiChapterSkipped.length} multi-chapter scenes:`);
      multiChapterSkipped.forEach(scene => {
        console.log(`    - ${scene.reference}: "${scene.name}"`);
      });
    }
    console.log();
  });

  console.log('✅ Torah pericope conversion complete!');
}

main();
