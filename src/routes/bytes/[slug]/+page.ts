export async function load({ params }: { params: { slug: string } }) {
  const post = await import(`../../../content/${params.slug}.md`);
  const { title, createdAt, summary, tags, author } = post.metadata;
  let formattedTags = tags.split(',').map(tag => tag.trim())
  const content = post.default;
  
  return {
    title,
    createdAt,
    summary,
    tags: formattedTags,
    author,
    content,
  };
}

