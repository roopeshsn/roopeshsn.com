import fetchBytes from '../../utils/fetchBytes';
import { website } from '$lib/info'

export const prerender = true;

type Byte = {
    meta: Record<string, any>
    path: string;
}

export async function GET() {
	const bytes: Byte[] = await fetchBytes();
	const body = xml(bytes);

	const headers = {
        'Cache-Control': `max-age=0, s-max-age=600`,
		'Content-Type': 'application/xml'
	};

	return new Response(body, { headers });
}

const xml = (bytes: Byte[]) => {
    return `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
      xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
        <url>
            <loc>${website}</loc>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${website}/bytes</loc>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${website}/resume</loc>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
        ${bytes
            .map(
              (byte) => `<url>
                <loc>${website}/${byte.path}</loc>
                <lastmod>${new Date(byte.meta.createdAt).toUTCString()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
              </url>`
            )
            .join('')}
    </urlset>
    `
}