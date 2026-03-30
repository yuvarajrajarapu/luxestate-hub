export const config = { runtime: 'edge' };

const DEFAULT_DESCRIPTION = 'Discover premium properties for sale, rent, and investment opportunities with UMY Infra.';
const FALLBACK_IMAGE = 'https://res.cloudinary.com/dswoyink7/image/upload/w_1200,h_630,c_fill,q_auto/umy-infra/logo-192.png';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getBaseUrl(req: Request): string {
  const host = req.headers.get('host') ?? 'www.umyinfra.in';
  return `https://${host}`;
}

async function fetchPropertyByCode(propertyCode: string) {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID ?? 'umy-infra';
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

  const body = {
    structuredQuery: {
      from: [{ collectionId: 'properties' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'propertyCode' },
          op: 'EQUAL',
          value: { stringValue: propertyCode.toUpperCase() },
        },
      },
      limit: 1,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) return null;

  const results = await response.json();
  const document = Array.isArray(results) ? results[0]?.document : null;
  const fields = document?.fields;

  if (!fields) return null;

  const stringField = (key: string, fallback = '') => fields[key]?.stringValue ?? fallback;

  const images = fields.images?.arrayValue?.values;
  const imageUrl = Array.isArray(images)
    ? images
        .map((image: any) => image?.mapValue?.fields?.url?.stringValue || image?.stringValue)
        .find(Boolean) || FALLBACK_IMAGE
    : FALLBACK_IMAGE;

  return {
    title: stringField('title', 'UMY Infra Property'),
    description: stringField('description', DEFAULT_DESCRIPTION),
    location: stringField('location', 'Kakinada, AP'),
    imageUrl,
  };
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const propertyCode = searchParams.get('code')?.trim();

  if (!propertyCode) {
    return new Response('Missing property code', { status: 400 });
  }

  const baseUrl = getBaseUrl(req);
  const propertyUrl = `${baseUrl}/property/${encodeURIComponent(propertyCode)}`;

  try {
    const property = await fetchPropertyByCode(propertyCode);

    if (!property) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: propertyUrl,
          'Cache-Control': 'no-store',
        },
      });
    }

    const title = escapeHtml(`${property.title} | UMY Infra`);
    const description = escapeHtml(property.description || `${property.location} | UMY Infra`);
    const image = escapeHtml(property.imageUrl || FALLBACK_IMAGE);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(propertyUrl)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="UMY Infra" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(propertyUrl)}" />
  <link rel="canonical" href="${escapeHtml(propertyUrl)}" />
</head>
<body>Redirecting to property...</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('OG generation failed', error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: propertyUrl,
        'Cache-Control': 'no-store',
      },
    });
  }
}
