import { sortDate } from "./sortDate";

export const fetchBytes = async (): Promise<Array<{
    meta: Record<string, any>,
    path: string,
  }>> => {
    const allPostFiles = await import.meta.glob('/src/content/*.md');
    const iterablePostFiles = Object.entries(allPostFiles);
  
    const allPosts = await Promise.all(
      iterablePostFiles.map(async ([path, resolver]) => {
        const module = await resolver();
        const metaData = module.metadata;
        const pathArray = path.split('/');
        const postPath = 'bytes/' + pathArray.pop();
        return {
          meta: metaData,
          path: postPath.substring(0, postPath.length - 3),
        };
      })
    );

    allPosts.sort(sortDate)
    allPosts.forEach(byte => byte.meta.createdAt = new Date(byte.meta.createdAt).toDateString())
    return allPosts;
};