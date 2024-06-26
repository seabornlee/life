// 转化成标题
export const parseTitle = (currentPage: string) => {
  const oldTitle = decodeURIComponent(currentPage.split('/posts/')[1]);
  let title = oldTitle;
  if (title.slice(-1) == '/') {
    title = title.substring(0, title.length - 1);
  }
  return title
}

//获取当前文章的序号
export const getIndex = (posts: any, currentPage: string) => {
  const title = decodeURIComponent(currentPage.split('/posts/')[1]).replaceAll('/', '');
  return posts.findIndex((p) => p.url.indexOf(title) > -1);
}

//排序所有的文章
export const sortPosts = (allPosts: any) => {
  return allPosts.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });
}
