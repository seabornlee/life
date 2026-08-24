import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(repoRoot, 'src/data/yes-to-being.json');
const data = JSON.parse(await readFile(dataPath, 'utf8'));
const errors = [];

if (data.id !== 'yes-to-being') errors.push('Unexpected series id.');
if (!Array.isArray(data.chapters)) errors.push('Series chapters must be an array.');
if (process.env.VERCEL && data.preview) {
  errors.push('Preview content cannot be deployed to Vercel.');
}

for (const chapter of data.chapters ?? []) {
  if (!chapter.slug || !/^[a-z0-9-]+$/.test(chapter.slug)) {
    errors.push(`Invalid slug for ${chapter.id ?? 'unknown chapter'}.`);
  }
  if (!chapter.sourceHash || chapter.sourceHash.length !== 64) {
    errors.push(`Missing source hash for ${chapter.id ?? 'unknown chapter'}.`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${data.chapters.length} series chapter(s).`);
