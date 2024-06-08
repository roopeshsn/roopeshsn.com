import sortDate from './sortDate';

const fetchTalks = async (): Promise<
	Array<{
		meta: Record<string, any>;
		path: string;
	}>
> => {
	const allTalksFiles = await import.meta.glob('/src/content/talks/*.md');
	const iterableTalksFiles = Object.entries(allTalksFiles);

	const allTalks = await Promise.all(
		iterableTalksFiles.map(async ([path, resolver]) => {
			const module: any = await resolver();
			const metaData = module.metadata;
			const pathArray = path.split('/');
			const postPath = 'talks/' + pathArray.pop();
			return {
				meta: metaData,
				path: postPath.substring(0, postPath.length - 3)
			};
		})
	);

	allTalks.sort(sortDate);
	allTalks.forEach((talk) => (talk.meta.createdAt = new Date(talk.meta.createdAt).toDateString()));
	return allTalks;
};

export default fetchTalks;
