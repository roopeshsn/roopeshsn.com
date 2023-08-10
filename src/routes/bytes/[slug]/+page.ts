export async function load({ params }: { params: { slug: string } }) {
  const post = await import(`../../../content/${params.slug}.md`);
  const { title, createdAt } = post.metadata;
  const content = post.default;
  
  return {
    content,
    title,
    createdAt,
  };
}

