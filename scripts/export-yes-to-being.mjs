import crypto from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const sourceRoot = process.env.YES_TO_BEING_SOURCE_ROOT
  ? path.resolve(process.env.YES_TO_BEING_SOURCE_ROOT)
  : path.resolve(
      repoRoot,
      '../../../knowledge-workspace/second-brain/写作/灵性/向存在说 Yes',
    );
const outputDir = path.join(repoRoot, 'src/pages/series/yes-to-being');
const dataPath = path.join(repoRoot, 'src/data/yes-to-being.json');
const assetOutputDir = path.join(
  repoRoot,
  'public/series/yes-to-being/assets',
);
const preview = process.argv.includes('--preview');
const toDateString = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
  return date.toISOString().slice(0, 10);
};

const manifest = JSON.parse(
  await readFile(path.join(sourceRoot, 'publication.json'), 'utf8'),
);
const illustrationManifest = JSON.parse(
  await readFile(
    path.join(sourceRoot, 'assets/illustrations/manifest.json'),
    'utf8',
  ),
);
const selectedCover = illustrationManifest.items.find(
  (item) => item.id === 'series-cover' && item.status === 'selected',
);

if (!selectedCover) {
  throw new Error('Series cover is not selected in the illustration manifest.');
}

await mkdir(outputDir, { recursive: true });
await mkdir(path.dirname(dataPath), { recursive: true });
await mkdir(assetOutputDir, { recursive: true });

const exportedChapters = [];

for (const chapter of manifest.chapters) {
  if (!chapter.publish && !preview) continue;

  const sourcePath = path.join(sourceRoot, chapter.source);
  const source = await readFile(sourcePath, 'utf8');
  const parsed = matter(source);

  if (parsed.data.id !== chapter.id) {
    throw new Error(`Chapter id mismatch in ${chapter.source}.`);
  }
  if (/For future Claude|\/Users\//.test(parsed.content)) {
    throw new Error(`Private or internal content found in ${chapter.source}.`);
  }

  const sourceHash = crypto.createHash('sha256').update(source).digest('hex');
  const publicationStatus = chapter.publish ? 'published' : 'local-preview';
  const publicData = {
    layout: '@layouts/series-post.astro',
    id: chapter.id,
    order: chapter.order,
    slug: chapter.slug,
    title: parsed.data.title,
    question: parsed.data.question,
    description: parsed.data.description,
    date: toDateString(parsed.data.date),
    updated: toDateString(parsed.data.updated),
    editorial_status: chapter.editorialStatus,
    publication_status: publicationStatus,
    cover: '/series/yes-to-being/assets/cover.jpg',
    diagram: parsed.data.diagram,
    diagram_alt: parsed.data.diagram_alt,
    sources: parsed.data.sources ?? [],
    source_id: manifest.series.sourceId,
    source_hash: sourceHash,
  };
  const output = matter.stringify(parsed.content.trimStart(), publicData);
  await writeFile(path.join(outputDir, `${chapter.slug}.md`), output, 'utf8');
  exportedChapters.push({
    id: chapter.id,
    order: chapter.order,
    slug: chapter.slug,
    title: parsed.data.title,
    description: parsed.data.description,
    updated: toDateString(parsed.data.updated),
    editorialStatus: chapter.editorialStatus,
    publicationStatus,
    sourceHash,
  });
}

await copyFile(
  path.join(sourceRoot, 'assets/illustrations', selectedCover.filename),
  path.join(assetOutputDir, 'cover.jpg'),
);
for (const name of [
  'obedience.svg',
  'forgiveness.svg',
  'church-community.svg',
  'authority.svg',
  'scripture-theology-church.svg',
  'lord-master-disciple.svg',
  'service-and-sacrifice.svg',
  'sin-and-original-sin.svg',
  'judgment-eternal-life-fear.svg',
  'judgment-eternal-life-fear-mobile.svg',
  'moses-and-pentateuch.svg',
  'moses-and-pentateuch-mobile.svg',
  'pilgrims-progress-as-path.svg',
  'pilgrims-progress-as-path-mobile.svg',
  'forbidden-fruit-boundary-death.svg',
  'healing-and-being-seen.svg',
  'giving-love-and-disclosure.svg',
  'god-as-attractor-yes-and.svg',
]) {
  await copyFile(
    path.join(sourceRoot, 'assets/illustrations', name),
    path.join(assetOutputDir, name),
  );
}

await writeFile(
  dataPath,
  `${JSON.stringify(
    {
      ...manifest.series,
      cover: '/series/yes-to-being/assets/cover.jpg',
      preview,
      chapters: exportedChapters,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(
  `Exported ${exportedChapters.length} chapter(s) in ${preview ? 'preview' : 'production'} mode.`,
);
