import sortDate from './sortDate';

const fetchNotes = async (): Promise<
	Array<{
		meta: Record<string, any>;
		path: string;
	}>
> => {
	const allPostFiles = await import.meta.glob('/src/content/notes/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const module: any = await resolver();
			const metaData = module.metadata;
			const pathArray = path.split('/');
			const postPath = 'notes/' + pathArray.pop();
			return {
				meta: metaData,
				path: postPath.substring(0, postPath.length - 3)
			};
		})
	);

	allPosts.sort(sortDate);
	allPosts.forEach((note) => (note.meta.createdAt = new Date(note.meta.createdAt).toDateString()));
	return allPosts;
};

export default fetchNotes;
