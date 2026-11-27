import { buildPropertyMetaHtml, buildPropertyMetadata, fetchPropertyByCode } from './_shared/property-metadata.js';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const propertyCode = searchParams.get('code')?.trim();

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
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
