import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
const version = pkg.version;

const chipPath = resolve(root, 'src/components/promo/hero-chip.astro');
const content = readFileSync(chipPath, 'utf-8');

const currentVersion = content.match(/^const version = '([^']+)';/m)?.[1];

if (currentVersion !== version) {
  const updated = content.replace(/^(const version = ')[^']+(';\s*)$/m, `$1${version}$2`);
  writeFileSync(chipPath, updated, 'utf-8');
  console.log('Updated version number in demo content to:', version);
}
