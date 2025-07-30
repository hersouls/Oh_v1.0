#!/usr/bin/env node

import { readdir, access } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const requiredAssets = [
  'manifest.json',
  'moonwave_log.png',
  'sw.js',
  'robots.txt'
];

const requiredDirectories = [
  'music',
  'covers'
];

async function checkFileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function verifyAssets() {
  console.log('🔍 Verifying build assets...');
  
  const distPath = join(__dirname, '..', 'dist');
  let allGood = true;
  
  // Check required files
  for (const asset of requiredAssets) {
    const assetPath = join(distPath, asset);
    const exists = await checkFileExists(assetPath);
    
    if (exists) {
      console.log(`✅ ${asset}`);
    } else {
      console.log(`❌ ${asset} - MISSING`);
      allGood = false;
    }
  }
  
  // Check required directories
  for (const dir of requiredDirectories) {
    const dirPath = join(distPath, dir);
    const exists = await checkFileExists(dirPath);
    
    if (exists) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`❌ ${dir}/ - MISSING`);
      allGood = false;
    }
  }
  
  if (allGood) {
    console.log('\n🎉 All assets verified successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some assets are missing. Please check your build process.');
    process.exit(1);
  }
}

verifyAssets().catch(error => {
  console.error('Error verifying assets:', error);
  process.exit(1);
});