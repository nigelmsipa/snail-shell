#!/usr/bin/env ts-node
/**
 * Verify that pericope index files match their data files
 * Run this script to catch export mismatches before they break the build
 */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface ValidationError {
  file: string;
  issue: string;
}

const errors: ValidationError[] = [];

function validatePericopeDir(dirPath: string, bookName: string) {
  const indexPath = join(dirPath, 'index.ts');
  const indexContent = readFileSync(indexPath, 'utf-8');
  
  const files = readdirSync(dirPath).filter(f => 
    f.endsWith('.ts') && f !== 'index.ts'
  );
  
  for (const file of files) {
    const chapterNum = file.match(/\d+/)?.[0];
    if (!chapterNum) continue;
    
    const filePath = join(dirPath, file);
    const fileContent = readFileSync(filePath, 'utf-8');
    
    // Check if the file exports expected data
    const exportName = `${bookName.toLowerCase()}${chapterNum}Data`;
    const expectedConstant = `${bookName.toUpperCase()}_${chapterNum}_PERICOPES`;
    
    if (!fileContent.includes(`export const ${exportName}`)) {
      errors.push({
        file: filePath,
        issue: `Missing export: ${exportName}`
      });
    }
    
    // Check if index file imports it correctly
    if (!indexContent.includes(`import { ${exportName} }`)) {
      errors.push({
        file: indexPath,
        issue: `Missing import for ${exportName} from ${file}`
      });
    }
    
    // Check if index creates the alias
    if (!indexContent.includes(`${expectedConstant} = ${exportName}.pericopes`)) {
      errors.push({
        file: indexPath,
        issue: `Missing alias: ${expectedConstant} = ${exportName}.pericopes`
      });
    }
  }
}

// Validate all pericope directories
const dataDir = join(process.cwd(), 'src', 'data');
const pericopes = [
  { dir: 'genesis_pericopes', name: 'GENESIS' },
  { dir: 'numbers_pericopes', name: 'NUMBERS' },
  { dir: 'deuteronomy_pericopes', name: 'DEUTERONOMY' },
];

console.log('🔍 Validating pericope exports...\n');

for (const { dir, name } of pericopes) {
  const dirPath = join(dataDir, dir);
  try {
    validatePericopeDir(dirPath, name);
  } catch (error) {
    console.log(`⚠️  Skipping ${dir}: ${error}`);
  }
}

if (errors.length > 0) {
  console.log('❌ Found export mismatches:\n');
  errors.forEach(({ file, issue }) => {
    console.log(`  ${file}`);
    console.log(`    → ${issue}\n`);
  });
  process.exit(1);
} else {
  console.log('✅ All pericope exports are valid!\n');
  process.exit(0);
}
