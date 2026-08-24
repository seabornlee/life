import series from '../data/yes-to-being.json';

const SITE = 'https://life.waterlee.site';

const postModules = import.meta.glob('./posts/*.md', { eager: true });
const seriesModules = import.meta.glob('./series/yes-to-being/*.md', { eager: true });

export const get = () => {
  const entries = [
    { url: '/', updated: new Date().toISOString().slice(0, 10) },
    ...(series.preview ? [] : [{ url: '/series/yes-to-being/', updated: series.updated }]),
    ...[...Object.values(postModules), ...Object.values(seriesModules)]
      .filter((item) => item.frontmatter.publication_status !== 'local-preview')
      .map((item) => ({
        url: item.url,
        updated: item.frontmatter.updated || item.frontmatter.date,
      })),
  ];
  const body = entries
    .map(({ url, updated }) => `<url><loc>${new URL(url, SITE).href}</loc>${updated ? `<lastmod>${new Date(updated).toISOString().slice(0, 10)}</lastmod>` : ''}</url>`)
    .join('');
  return {
    body: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  };
};
