import rss from '@astrojs/rss';

let allPosts = import.meta.glob('./posts/*.md', { eager: true });
let seriesPosts = import.meta.glob('./series/yes-to-being/*.md', { eager: true });
let posts = [...Object.values(allPosts), ...Object.values(seriesPosts)]
  .filter((item) => item.frontmatter.publication_status !== 'local-preview');
posts = posts.sort((a, b) => {
  return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
});

export const get = () =>
  rss({
    title: 'Water Lee\'s Life',
    description: '记录 Water Lee 的工作、学习与生活',
    site: 'https://life.waterlee.site',
    customData: `<image><url>https://gw.alipayobjects.com/zos/k/qv/coffee-2-icon.png</url></image>`,
    items: posts.map((item) => {
      const url = item.url;
      const title = item.frontmatter.title || decodeURIComponent(url.split('/').filter(Boolean).at(-1));
      return {
        link: url,
        title,
        description: item.compiledContent(),
        pubDate: item.frontmatter.date,
      };
    }),
  });
