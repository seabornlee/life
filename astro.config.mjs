import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import dayjs from 'dayjs';
import fs from 'fs';
import { defineConfig } from 'astro/config';
import { parse } from 'node-html-parser';
import { SITE } from './src/config';

function defaultLayoutPlugin() {
  return function (tree, file) {
    const filePath = file.history[0];
    file.data.astro.frontmatter.layout = '@layouts/post.astro';

    // 头图放到文档中的第一行，会自动帮你处理，也可以用 frontmatter 方式，赋值给 pic 字段
    if (tree.children[0]?.value) {
      const imageElement = parse(tree.children[0].value).querySelector('img');
      file.data.astro.frontmatter.pic = imageElement.getAttribute('src');
    }

    // 描述放到文档中头图的下一行，会自动帮你处理，也可以用 frontmatter 方式，赋值给 desc 字段
    if (tree.children[1]?.children[1]?.value) {
      file.data.astro.frontmatter.desc = tree.children[1].children[1].value;
    }

    const { date, desc, pic } = file.data.astro.frontmatter;

    // 兼容没有描述情况
    if (!desc) {
      file.data.astro.frontmatter.desc = SITE.description;
    }

    // 兼容没有头图的情况
    if (!pic) {
      file.data.astro.frontmatter.pic = SITE.pic;
    }

    //这里也可以直接在 frontmatter，赋值给 date 字段
    if (!date) {
      const createDate = dayjs(fs.statSync(filePath).atime).format(
        'YYYY/MM/DD',
      );
      file.data.astro.frontmatter.date = createDate;
    }
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  markdown: {
    remarkPlugins: [defaultLayoutPlugin],
    extendDefaultPlugins: false,
  },
});
