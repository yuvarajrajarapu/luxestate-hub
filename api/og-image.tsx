import { fetchPropertyByCode } from './_shared/property-metadata.js';

export const config = {
  maxDuration: 60,
};

async function handler(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const propertyCode = searchParams.get('code')?.trim() || searchParams.get('propertyCode')?.trim() || '';

  if (!propertyCode) {
    return new Response('Missing property code', { status: 400 });
  }

  const property = await fetchPropertyByCode(propertyCode);

  if (!property) {
    return new Response('Property not found', { status: 404 });
  }

  const imageUrl = property.images
    ?.map((image) => (typeof image === 'string' ? image : image.url || ''))
    .find((candidate) => {
      try {
        const url = new URL(candidate);
        return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com';
      } catch {
        return false;
      }
    });

  if (!imageUrl) {
    return new Response('Property image not found', { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: imageUrl,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export default { fetch: handler };
