import { buildPropertyMetaHtml, buildPropertyMetadata, fetchPropertyByCode } from './_shared/property-metadata';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const propertyCode = url.searchParams.get('code')?.trim() || '';

    if (!propertyCode) {
      return new Response('Missing property code', { status: 400 });
    }

    const property = await fetchPropertyByCode(propertyCode);

    if (!property) {
      return new Response('Property not found', { status: 404 });
    }

    const metadata = buildPropertyMetadata(property);
    const html = buildPropertyMetaHtml(metadata);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('SSR Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
