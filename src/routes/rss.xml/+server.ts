import fetchBytes from '../../utils/fetchBytes';
import { name, website } from '$lib/info'

export const prerender = true;

type Byte = {
  meta: Record<string, any>
  path: string;
}

export async function GET() {
	const bytes: Byte[] = await fetchBytes();
	const body = xml(bytes);

	const headers = {
		'Cache-Control': 'max-age=0, s-max-age=600',
		'Content-Type': 'application/xml'
	};

	return new Response(body, { headers });
}

const xml = (
	bytes: Byte[]
) => `<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${name}'s blog</title>
    <link>${website}/bytes</link>
    <description>Bytes are a shorter form of a blog post that is not boring, clear, and concise.</description>
    <atom:link href="${website}/rss.xml" rel="self" type="application/rss+xml" />
    ${bytes
			.map(
				(byte) =>
					`
          <item>
            <guid>${website}/${byte.path}/</guid>
            <title>${byte.meta.title}</title>
            <description>${byte.meta.summary}</description>
            <link>${website}/${byte.path}/</link>
            <pubDate>${new Date(byte.meta.createdAt).toUTCString()}</pubDate>
          </item>
        `
			)
			.join('')}
  </channel>
</rss>`;
