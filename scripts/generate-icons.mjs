/**
 * generate-icons.mjs
 * Generates PNG icons from the SVG source using the `sharp` package.
 *
 * Usage:
 *   npm install sharp --save-dev
 *   node scripts/generate-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'public', 'icons', 'icon.svg');
const outDir = join(root, 'public', 'icons');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error(
      '❌  sharp not found. Run: npm install sharp --save-dev'
    );
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });
  const svgBuffer = readFileSync(svgPath);

  for (const size of SIZES) {
    const outPath = join(outDir, `icon-${size}.png`);
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath);
    console.log(`✅  ${size}×${size}  →  ${outPath}`);
  }

  // Copy 192 and 512 with the names used by manifest.json
  const buf192 = readFileSync(join(outDir, 'icon-192.png'));
  writeFileSync(join(outDir, 'icon-192.png'), buf192);
  const buf512 = readFileSync(join(outDir, 'icon-512.png'));
  writeFileSync(join(outDir, 'icon-512.png'), buf512);

  console.log('\n🌱  All icons generated successfully!');
}

main();
