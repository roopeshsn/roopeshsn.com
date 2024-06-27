export async function load({ params }: { params: { slug: string } }) {
	const post = await import(`../../../content/bytes/${params.slug}.md`);
	const { title, createdAt, updatedAt, summary, tags, author, image } = post.metadata;
	let formattedTags = tags.split(',').map((tag: string) => tag.trim());
	const content = post.default;

	return {
		title,
		createdAt,
		updatedAt,
		summary,
		tags: formattedTags,
		author,
		image,
		content
	};
}
