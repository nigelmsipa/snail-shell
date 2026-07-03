#!/usr/bin/env node
/**
 * REGENERATE: Refine all pericopes from Memory Method Bible scenes
 * Converts 52 MMB scenes per book into properly-granulated pericopes (6-12 verses)
 *
 * THIS FIX: Solves the over-consolidation problem (27+ verses per pericope)
 * by using MMB text-driven scene boundaries which naturally hit 6-12 verses
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MMB_DIR = '/home/nigel/memory-method-bible/data/base-structure';
const OUT_DIR = path.join(__dirname, 'pericopes');

// Map book files to export names
const BOOKS = {
  'joshua-base.json': 'JOSHUA_PERICOPES',
  'judges-base.json': 'JUDGES_PERICOPES',
  'ruth-base.json': 'RUTH_PERICOPES',
  '1samuel-base.json': '1SAMUEL_PERICOPES',
  '2samuel-base.json': '2SAMUEL_PERICOPES',
  '1kings-base.json': '1KINGS_PERICOPES',
  '2kings-base.json': '2KINGS_PERICOPES',
  '1chronicles-base.json': '1CHRONICLES_PERICOPES',
  '2chronicles-base.json': '2CHRONICLES_PERICOPES',
  'ezra-base.json': 'EZRA_PERICOPES',
  'nehemiah-base.json': 'NEHEMIAH_PERICOPES',
  'esther-base.json': 'ESTHER_PERICOPES'
};

// Output file mappings
const FILE_MAP = {
  'joshua-base.json': '06_joshua.js',
  'judges-base.json': '07_judges.js',
  'ruth-base.json': '08_ruth.js',
  '1samuel-base.json': '09_1samuel.js',
  '2samuel-base.json': '10_2samuel.js',
  '1kings-base.json': '11_1kings.js',
  '2kings-base.json': '12_2kings.js',
  '1chronicles-base.json': '13_1chronicles.js',
  '2chronicles-base.json': '14_2chronicles.js',
  'ezra-base.json': '15_ezra.js',
  'nehemiah-base.json': '16_nehemiah.js',
  'esther-base.json': '17_esther.js'
};

function shortenTitle(title, maxLength = 50) {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 1).trim();
}

function generatePericopesFromMMB(mmbData, exportName) {
  const pericopes = [];

  mmbData.stories.forEach(story => {
    story.scenes.forEach(scene => {
      const ref = scene.reference; // Format: "1:1-9" or "1:1-24"
      const [chStr, versesStr] = ref.split(':');
      const [startStr, endStr] = versesStr.split('-');

      const chapter = parseInt(chStr);
      const verse_start = parseInt(startStr);
      const verse_end = parseInt(endStr);

      // Use scene name as pericope title (already good)
      const name = shortenTitle(scene.scene_name);

      pericopes.push({
        chapter,
        verse_start,
        verse_end,
        name
      });
    });
  });

  return pericopes;
}

function generateJSFile(exportName, pericopes, bookName) {
  const header = `/**
 * ${bookName.toUpperCase()} PERICOPES
 * Regenerated from Memory Method Bible scenes for proper memorization granularity
 * Target: 6-12 verses per pericope, evocative titles
 */

export const ${exportName} = [`;

  const entries = pericopes.map(p => {
    // Escape single quotes in titles
    const safeName = p.name.replace(/'/g, "\\'");
    return `  { chapter: ${p.chapter}, verse_start: ${p.verse_start}, verse_end: ${p.verse_end}, name: '${safeName}' }`;
  }).join(',\n');

  const footer = `\n];

export default ${exportName};`;

  return header + '\n' + entries + footer;
}

async function main() {
  console.log('\n🔧 REGENERATING: Joshua-Esther Pericopes from Memory Method Bible\n');
  console.log('='.repeat(100));
  console.log('Replacing over-consolidated pericopes with MMB scene-based divisions\n');

  let successCount = 0;
  let failCount = 0;
  let totalScenesBefore = 0;
  let totalScenesAfter = 0;

  for (const [mmbFile, exportName] of Object.entries(BOOKS)) {
    const jsFile = FILE_MAP[mmbFile];
    const bookName = mmbFile.replace('-base.json', '').replace(/\d+/, match => {
      const num = parseInt(match);
      return num === 1 ? '1' : num === 2 ? '2' : num === 3 ? '3' : match;
    });

    try {
      // Read MMB file
      const mmbPath = path.join(MMB_DIR, mmbFile);
      const mmbData = JSON.parse(fs.readFileSync(mmbPath, 'utf8'));

      // Count scenes
      let sceneCount = 0;
      mmbData.stories.forEach(s => {
        sceneCount += s.scenes.length;
      });

      // Generate pericopes from scenes
      const pericopes = generatePericopesFromMMB(mmbData, exportName);
      totalScenesAfter += pericopes.length;

      // Read old file to get old count
      const oldPath = path.join(OUT_DIR, jsFile);
      const oldContent = fs.readFileSync(oldPath, 'utf8');
      const oldCount = (oldContent.match(/\{ chapter:/g) || []).length;
      totalScenesBefore += oldCount;

      // Generate JS file
      const jsContent = generateJSFile(exportName, pericopes, bookName);

      // Write new file
      fs.writeFileSync(oldPath, jsContent);

      const avgVerses = (pericopes.reduce((sum, p) => sum + (p.verse_end - p.verse_start + 1), 0) / pericopes.length).toFixed(1);

      console.log(`✅ ${jsFile.padEnd(30)} ${oldCount} → ${pericopes.length} pericopes | avg ${avgVerses}v/p`);
      successCount++;

    } catch (error) {
      console.log(`❌ ${jsFile.padEnd(30)} ERROR: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log(`\n✅ Success: ${successCount}/12 books regenerated`);
  console.log(`❌ Failed: ${failCount}/12 books`);
  console.log(`\n📊 BEFORE:  ${totalScenesBefore} total pericopes`);
  console.log(`📊 AFTER:   ${totalScenesAfter} total pericopes`);
  console.log(`📈 IMPROVEMENT: ${((totalScenesAfter / totalScenesBefore - 1) * 100).toFixed(0)}% more granular\n`);
  console.log('🎉 Pericopes regenerated! Run: npm run import-pericopes\n');
}

main().catch(console.error);
