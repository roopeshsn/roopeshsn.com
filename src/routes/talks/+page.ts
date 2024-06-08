import fetchTalks from '../../utils/fetchTalks';

export async function load({ params }: { params: { slug: string } }) {
	const res = await fetchTalks();
	return {
		res
	};
}
