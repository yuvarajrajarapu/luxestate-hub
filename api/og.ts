export const config = { runtime: 'edge' };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

function getStringField(fields: any, key: string, fallback = ''): string {
  return fields?.[key]?.stringValue || fallback;
}

function getNumberField(fields: any, key: string): number {
  return toNumber(fields?.[key]?.integerValue ?? fields?.[key]?.doubleValue ?? fields?.[key]?.stringValue ?? 0);
}

function getFirstImage(fields: any): string {
  const values = fields?.images?.arrayValue?.values;
  if (!Array.isArray(values) || values.length === 0) {
    return 'https://www.umyinfra.in/og-image.png';
  }

  const first = values[0];
  if (first?.stringValue) return first.stringValue;
  if (first?.mapValue?.fields?.url?.stringValue) return first.mapValue.fields.url.stringValue;

  return 'https://www.umyinfra.in/og-image.png';
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing property id', { status: 400 });
  }

  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'umy-infra';
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/properties/${id}`;

    const res = await fetch(firestoreUrl);
    const data = res.ok ? ((await res.json()) as any) : {};
    const fields = data?.fields || {};

    const title = getStringField(fields, 'title', 'Property | UMY Infra');
    const price = getNumberField(fields, 'price') || getNumberField(fields, 'totalPrice');
    const location = getStringField(fields, 'location', 'Kakinada, AP');
    const imageUrl = getFirstImage(fields);
    const description = `${formatPrice(price)} | ${location} | UMY Infra Real Estate`;
    const propertyUrl = `https://www.umyinfra.in/property/${encodeURIComponent(id)}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | UMY Infra</title>
  <meta property="og:title" content="${escapeHtml(title)} | UMY Infra" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(propertyUrl)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="UMY Infra" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)} | UMY Infra" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
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
  } catch {
    const fallbackUrl = `https://www.umyinfra.in/property/${encodeURIComponent(id)}`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: fallbackUrl,
        'Cache-Control': 'no-store',
      },
    });
  }
}
