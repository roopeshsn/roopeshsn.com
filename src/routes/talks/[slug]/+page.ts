export async function load({ params }: { params: { slug: string } }) {
	const talk = await import(`../../../content/talks/${params.slug}.md`);
	const { title, createdAt, updatedAt, summary, tags, author } = talk.metadata;
	let formattedTags = tags.split(',').map((tag: string) => tag.trim());
	const content = talk.default;

	return {
		title,
		createdAt,
		updatedAt,
		summary,
		tags: formattedTags,
		author,
		content
	};
}
