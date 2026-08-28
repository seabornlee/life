import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const references = [
  { reference: '约翰福音 13:13-15', book: 43, chapter: 13, start: 13, end: 15 },
  { reference: '路加福音 6:40', book: 42, chapter: 6, start: 40, end: 40 },
  { reference: '约翰福音 15:14-15', book: 43, chapter: 15, start: 14, end: 15 },
  { reference: '马可福音 8:34-35', book: 41, chapter: 8, start: 34, end: 35 },
  { reference: '罗马书 10:9', book: 45, chapter: 10, start: 9, end: 9 },
  { reference: '约翰福音 13:12-15', book: 43, chapter: 13, start: 12, end: 15 },
  { reference: '加拉太书 5:13', book: 48, chapter: 5, start: 13, end: 13 },
  { reference: '腓立比书 2:4-8', book: 50, chapter: 2, start: 4, end: 8 },
  { reference: '哥林多后书 8:13-14', book: 47, chapter: 8, start: 13, end: 14 },
  { reference: '马可福音 6:31', book: 41, chapter: 6, start: 31, end: 31 },
  { reference: '创世记 1:26-27', book: 1, chapter: 1, start: 26, end: 27 },
  { reference: '创世记 3:1-19', book: 1, chapter: 3, start: 1, end: 19 },
  { reference: '罗马书 3:23', book: 45, chapter: 3, start: 23, end: 23 },
  { reference: '罗马书 5:12-19', book: 45, chapter: 5, start: 12, end: 19 },
  { reference: '雅各书 1:14-15', book: 59, chapter: 1, start: 14, end: 15 },
  { reference: '以西结书 18:20', book: 26, chapter: 18, start: 20, end: 20 },
  { reference: '提摩太后书 3:16-17', book: 55, chapter: 3, start: 16, end: 17 },
  { reference: '使徒行传 17:11', book: 44, chapter: 17, start: 11, end: 11 },
  { reference: '雅各书 1:22-25', book: 59, chapter: 1, start: 22, end: 25 },
  { reference: '申命记 6:4', book: 5, chapter: 6, start: 4, end: 4 },
  { reference: '使徒行传 5:29', book: 44, chapter: 5, start: 29, end: 29 },
  { reference: '腓立比书 2:8', book: 50, chapter: 2, start: 8, end: 8 },
  { reference: '约翰福音 14:15', book: 43, chapter: 14, start: 15, end: 15 },
  { reference: '加拉太书 6:7', book: 48, chapter: 6, start: 7, end: 7 },
  { reference: '以弗所书 4:32', book: 49, chapter: 4, start: 32, end: 32 },
  { reference: '马太福音 6:12', book: 40, chapter: 6, start: 12, end: 12 },
  { reference: '马太福音 18:21-35', book: 40, chapter: 18, start: 21, end: 35 },
  { reference: '路加福音 17:3', book: 42, chapter: 17, start: 3, end: 3 },
  { reference: '罗马书 12:18', book: 45, chapter: 12, start: 18, end: 18 },
  { reference: '使徒行传 2:42-47', book: 44, chapter: 2, start: 42, end: 47 },
  { reference: '哥林多前书 12:12-27', book: 46, chapter: 12, start: 12, end: 27 },
  { reference: '加拉太书 6:2', book: 48, chapter: 6, start: 2, end: 2 },
  { reference: '希伯来书 10:24-25', book: 58, chapter: 10, start: 24, end: 25 },
  { reference: '彼得前书 4:10', book: 60, chapter: 4, start: 10, end: 10 },
  { reference: '马太福音 23:8-12', book: 40, chapter: 23, start: 8, end: 12 },
  { reference: '马可福音 10:42-45', book: 41, chapter: 10, start: 42, end: 45 },
  { reference: '彼得前书 5:2-3', book: 60, chapter: 5, start: 2, end: 3 },
  { reference: '罗马书 13:1', book: 45, chapter: 13, start: 1, end: 1 },
  { reference: '马太福音 25:31-46', book: 40, chapter: 25, start: 31, end: 46 },
  { reference: '约翰福音 5:28-29', book: 43, chapter: 5, start: 28, end: 29 },
  { reference: '彼得后书 3:9', book: 61, chapter: 3, start: 9, end: 9 },
  { reference: '哥林多前书 15:20-28', book: 46, chapter: 15, start: 20, end: 28 },
  { reference: '启示录 21:1-5', book: 66, chapter: 21, start: 1, end: 5 },
  { reference: '出埃及记 3:1-15', book: 2, chapter: 3, start: 1, end: 15 },
  { reference: '出埃及记 24:3-4', book: 2, chapter: 24, start: 3, end: 4 },
  { reference: '民数记 33:1-2', book: 4, chapter: 33, start: 1, end: 2 },
  { reference: '申命记 31:9', book: 5, chapter: 31, start: 9, end: 9 },
  { reference: '申命记 34:1-12', book: 5, chapter: 34, start: 1, end: 12 },
  { reference: '诗篇 90:1-2', book: 19, chapter: 90, start: 1, end: 2 },
  { reference: '罗马书 7:24-25', book: 45, chapter: 7, start: 24, end: 25 },
  { reference: '马太福音 7:13-14', book: 40, chapter: 7, start: 13, end: 14 },
  { reference: '希伯来书 11:13-16', book: 58, chapter: 11, start: 13, end: 16 },
  { reference: '希伯来书 12:1-2', book: 58, chapter: 12, start: 1, end: 2 },
  { reference: '腓立比书 3:13-14', book: 50, chapter: 3, start: 13, end: 14 },
  { reference: '使徒行传 20:7', book: 44, chapter: 20, start: 7, end: 7 },
  { reference: '哥林多前书 16:2', book: 46, chapter: 16, start: 2, end: 2 },
  { reference: '启示录 1:10', book: 66, chapter: 1, start: 10, end: 10 },
  { reference: '创世记 2:16-17', book: 1, chapter: 2, start: 16, end: 17 },
  { reference: '创世记 3:2-5', book: 1, chapter: 3, start: 2, end: 5 },
  { reference: '创世记 3:7-24', book: 1, chapter: 3, start: 7, end: 24 },
  { reference: '马可福音 5:25-34', book: 41, chapter: 5, start: 25, end: 34 },
  { reference: '马太福音 9:20-22', book: 40, chapter: 9, start: 20, end: 22 },
  { reference: '路加福音 8:43-48', book: 42, chapter: 8, start: 43, end: 48 },
  { reference: '利未记 15:25-30', book: 3, chapter: 15, start: 25, end: 30 },
  { reference: '马太福音 22:39', book: 40, chapter: 22, start: 39, end: 39 },
  { reference: '马太福音 6:1-4', book: 40, chapter: 6, start: 1, end: 4 },
  { reference: '马太福音 5:16', book: 40, chapter: 5, start: 16, end: 16 },
  { reference: '以弗所书 4:25', book: 49, chapter: 4, start: 25, end: 25 },
  { reference: '哥林多前书 13:4-5', book: 46, chapter: 13, start: 4, end: 5 },
  { reference: '出埃及记 23:10-11', book: 2, chapter: 23, start: 10, end: 11 },
  { reference: '利未记 25:1-7', book: 3, chapter: 25, start: 1, end: 7 },
  { reference: '申命记 15:1-11', book: 5, chapter: 15, start: 1, end: 11 },
  { reference: '出埃及记 20:8-11', book: 2, chapter: 20, start: 8, end: 11 },
  { reference: '申命记 5:12-15', book: 5, chapter: 5, start: 12, end: 15 },
];

const translation = {
  id: 'CUNPS',
  name: '新标点和合本（简体）',
  sourceName: 'Bolls Bible',
  sourceRoot: 'https://bolls.life',
};
const chapterCache = new Map();

async function getChapter(book, chapter) {
  const cacheKey = `${book}:${chapter}`;
  if (chapterCache.has(cacheKey)) return chapterCache.get(cacheKey);

  const url = `${translation.sourceRoot}/get-text/${translation.id}/${book}/${chapter}/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to fetch ${url}: ${response.status}`);
  const verses = await response.json();
  chapterCache.set(cacheKey, { url, verses });
  return chapterCache.get(cacheKey);
}

const entries = [];
for (const item of references) {
  const chapter = await getChapter(item.book, item.chapter);
  const verses = chapter.verses
    .filter(({ verse }) => verse >= item.start && verse <= item.end)
    .map(({ verse, text }) => ({
      number: verse,
      text: text.replace(/<[^>]*>/g, '').replace(/\s+/g, ''),
    }));

  const expectedCount = item.end - item.start + 1;
  if (verses.length !== expectedCount) {
    throw new Error(
      `${item.reference} expected ${expectedCount} verse(s), received ${verses.length}.`,
    );
  }

  entries.push({
    reference: item.reference,
    book: item.book,
    chapter: item.chapter,
    start: item.start,
    end: item.end,
    sourceUrl: `${translation.sourceRoot}/${translation.id}/${item.book}/${item.chapter}/`,
    verses,
  });
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(scriptDir, '../src/data/scriptures.json');
const data = {
  version: 1,
  translation,
  entries,
};

await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`Synced ${entries.length} scripture excerpt(s) to ${outputPath}.`);
