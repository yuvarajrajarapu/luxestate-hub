export const config = {
  runtime: 'edge',
};

const SITE_URL = 'https://www.umyinfra.in';
const PAGE_SIZE = 1000;
const MAX_SITEMAP_URLS = 50_000;
const STATIC_PATHS = [
  '/',
  '/properties',
  '/land/plot',
  '/land/agricultural',
  '/land/farm-houses',
];

interface FirestoreValue {
  stringValue?: string;
  booleanValue?: boolean;
  timestampValue?: string;
}

interface FirestoreDocument {
  name?: string;
  updateTime?: string;
  fields?: Record<string, FirestoreValue>;
}

interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchProperties(): Promise<FirestoreDocument[]> {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.VITE_FIREBASE_PROJECT_ID ??
    'yuvainfraedge';
  const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/properties`;
  const documents: FirestoreDocument[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(endpoint);
    url.searchParams.set('pageSize', String(PAGE_SIZE));
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Firestore sitemap query failed with status ${response.status}`);
    }

    const page = (await response.json()) as {
      documents?: FirestoreDocument[];
      nextPageToken?: string;
    };

    documents.push(...(page.documents ?? []));
    if (documents.length > MAX_SITEMAP_URLS) {
      throw new Error(`Property collection exceeds the ${MAX_SITEMAP_URLS}-URL sitemap limit`);
    }

    pageToken = page.nextPageToken;
  } while (pageToken);

  return documents;
}

function getPropertyEntry(document: FirestoreDocument): SitemapEntry | null {
  const fields = document.fields;
  const documentId = document.name?.split('/').pop();
  const propertyCode = fields?.propertyCode?.stringValue?.trim() || documentId;

  if (!propertyCode || fields?.isSoldOut?.booleanValue === true) return null;

  const updatedAt = fields?.updatedAt?.timestampValue || document.updateTime;
  const updatedAtMs = updatedAt ? Date.parse(updatedAt) : Number.NaN;

  return {
    loc: `${SITE_URL}/property/${encodeURIComponent(propertyCode)}`,
    ...(Number.isNaN(updatedAtMs)
      ? {}
      : { lastmod: new Date(updatedAtMs).toISOString().slice(0, 10) }),
  };
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export default async function handler(_request: Request) {
  try {
    const entries: SitemapEntry[] = STATIC_PATHS.map((path) => ({
      loc: `${SITE_URL}${path}`,
    }));
    const existingUrls = new Set(entries.map((entry) => entry.loc));

    for (const document of await fetchProperties()) {
      const entry = getPropertyEntry(document);
      if (entry && !existingUrls.has(entry.loc)) {
        entries.push(entry);
        existingUrls.add(entry.loc);
      }
    }

    if (entries.length > MAX_SITEMAP_URLS) {
      throw new Error(`Sitemap exceeds the ${MAX_SITEMAP_URLS}-URL limit`);
    }

    return new Response(generateSitemapXml(entries), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    return new Response('Sitemap temporarily unavailable', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
}
