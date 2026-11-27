const SITE_NAME = 'UMY Infra';
const SITE_URL = 'https://www.umyinfra.in';
const SITE_LOCALE = 'en_IN';
const TWITTER_HANDLE = '@umyinfra';
const DEFAULT_DESCRIPTION = 'Discover verified property listings in India with UMY Infra.';
const DEFAULT_KEYWORDS = [
  'UMY Infra',
  'real estate',
  'property for sale',
  'property for rent',
  'property for lease',
  'Kakinada property',
  'India property listings',
];

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number | string;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

export interface PropertyRecord {
  id: string;
  propertyCode: string;
  title: string;
  description: string;
  category?: string;
  mainCategory?: string;
  listingType?: 'sale' | 'rent' | 'lease';
  propertyType?: string;
  location?: string;
  city?: string;
  state?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  price?: number;
  priceUnit?: 'total' | 'per-month' | 'per-year' | 'per-sqft';
  images?: Array<{ url?: string } | string>;
  isVerified?: boolean;
  isFeatured?: boolean;
  possessionStatus?: string;
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyMetadata {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  themeColor: string;
  language: string;
  viewport: string;
  canonicalUrl: string;
  ogUrl: string;
  ogType: 'article';
  ogSiteName: string;
  ogLocale: string;
  ogImage: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogImageAlt: string;
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  property: PropertyRecord;
  primaryImageUrl: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function absoluteUrl(pathOrUrl: string, baseUrl = SITE_URL): string {
  if (!pathOrUrl) return baseUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      const url = new URL(pathOrUrl);
      return `${baseUrl.replace(/\/$/, '')}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return pathOrUrl;
    }
  }

  return `${baseUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`;
}

function canonicalizeUrl(url: string): string {
  return absoluteUrl(url, SITE_URL);
}

function normalizePropertyCode(code: string): string {
  return code.trim().toUpperCase();
}

function readStringField(fields: Record<string, FirestoreValue>, key: string): string {
  return fields[key]?.stringValue ?? '';
}

function readNumberField(fields: Record<string, FirestoreValue>, key: string): number | undefined {
  const value = fields[key];
  if (!value) return undefined;

  if (typeof value.doubleValue === 'number') return value.doubleValue;
  if (typeof value.doubleValue === 'string') return Number(value.doubleValue);
  if (typeof value.integerValue === 'string') return Number(value.integerValue);

  return undefined;
}

function readBooleanField(fields: Record<string, FirestoreValue>, key: string): boolean | undefined {
  const value = fields[key]?.booleanValue;
  return typeof value === 'boolean' ? value : undefined;
}

function readStringArray(fields: Record<string, FirestoreValue>, key: string): string[] {
  const values = fields[key]?.arrayValue?.values ?? [];
  return values.map((item) => item.stringValue ?? item.mapValue?.fields?.name?.stringValue ?? '').filter(Boolean);
}

function readPrimaryImage(fields: Record<string, FirestoreValue>): string {
  const images = fields.images?.arrayValue?.values ?? [];

  for (const image of images) {
    const url = image.stringValue ?? image.mapValue?.fields?.url?.stringValue ?? '';
    if (url) return absoluteUrl(url, SITE_URL);
  }

  const fallback = fields.featuredImage?.stringValue ?? fields.featured_image?.stringValue ?? '';
  return fallback ? absoluteUrl(fallback, SITE_URL) : '';
}

function formatIndianPrice(price?: number, priceUnit?: PropertyRecord['priceUnit']): string {
  if (!price || Number.isNaN(price)) return '';

  let formatted = '';
  if (price >= 10000000) {
    const value = price / 10000000;
    formatted = `₹${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)} Cr`;
  } else if (price >= 100000) {
    const value = price / 100000;
    formatted = `₹${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)} L`;
  } else {
    formatted = `₹${price.toLocaleString('en-IN')}`;
  }

  if (priceUnit === 'per-month') return `${formatted}/mo`;
  if (priceUnit === 'per-year') return `${formatted}/yr`;
  if (priceUnit === 'per-sqft') return `${formatted}/sq ft`;

  return formatted;
}

function formatArea(area?: number, areaUnit?: string): string {
  if (!area || Number.isNaN(area)) return '';

  const normalizedUnit = (areaUnit || 'sqft').toLowerCase();
  if (normalizedUnit === 'acres') return `${area.toLocaleString('en-IN')} Acres`;
  if (normalizedUnit === 'cents') return `${area.toLocaleString('en-IN')} Cents`;
  if (normalizedUnit === 'sqyd') return `${area.toLocaleString('en-IN')} Sq Yd`;
  return `${area.toLocaleString('en-IN')} Sq Ft`;
}

function propertyTypeLabel(property: PropertyRecord): string {
  if (property.propertyType?.trim()) return property.propertyType.trim();

  const category = (property.category || '').toLowerCase();
  if (category.includes('flat')) return 'Apartment';
  if (category.includes('house')) return 'Villa';
  if (category.includes('land')) return 'Plot';
  if (category.includes('commercial')) return 'Commercial Space';
  if (category.includes('pg')) return 'PG/Hostel';

  return 'Property';
}

function listingVerb(listingType?: PropertyRecord['listingType']): string {
  if (listingType === 'rent') return 'Rent';
  if (listingType === 'lease') return 'Lease';
  return 'Sale';
}

function resolveLocation(property: PropertyRecord): string {
  return property.location?.trim() || property.city?.trim() || property.address?.trim() || 'India';
}

function buildPropertyTitle(property: PropertyRecord): string {
  const bedrooms = property.bedrooms ? `${property.bedrooms} BHK ` : '';
  const label = propertyTypeLabel(property);
  const verb = listingVerb(property.listingType);
  const location = resolveLocation(property);
  const price = formatIndianPrice(property.price, property.priceUnit);
  const headline = `${bedrooms}${label} for ${verb} in ${location}`;

  return price ? `${headline} | ${price} | ${SITE_NAME}` : `${headline} | ${SITE_NAME}`;
}

function buildPropertyDescription(property: PropertyRecord): string {
  const parts: string[] = [];
  const verb = listingVerb(property.listingType).toLowerCase();
  const verification = property.isVerified ? 'verified ' : '';
  const bedrooms = property.bedrooms ? `${property.bedrooms} BHK ` : '';
  const label = propertyTypeLabel(property).toLowerCase();
  const location = resolveLocation(property);
  const address = property.address?.trim();
  const area = formatArea(property.area, property.areaUnit);
  const price = formatIndianPrice(property.price, property.priceUnit);
  const possession = property.possessionStatus ? property.possessionStatus.replace(/-/g, ' ') : '';
  const amenityText = property.amenities?.length ? property.amenities.slice(0, 2).join(', ') : '';

  parts.push(`${verification}${bedrooms}${label} for ${verb} in ${location}`.replace(/\s+/g, ' ').trim());

  if (address && address !== location) parts.push(`near ${address}`);
  if (area) parts.push(area);
  if (price) parts.push(price);
  if (possession) parts.push(possession);
  if (amenityText) parts.push(amenityText);

  return `${parts.filter(Boolean).join(', ')}.`;
}

function buildPropertyKeywords(property: PropertyRecord): string {
  const type = propertyTypeLabel(property);
  const location = resolveLocation(property);
  const bedrooms = property.bedrooms ? `${property.bedrooms} BHK` : '';
  const price = formatIndianPrice(property.price, property.priceUnit);

  const keywords = [
    ...DEFAULT_KEYWORDS,
    property.title,
    type,
    location,
    property.city,
    property.state,
    bedrooms,
    price,
    property.category,
    property.mainCategory,
    property.listingType,
  ]
    .map((value) => (value || '').trim())
    .filter(Boolean);

  return Array.from(new Set(keywords)).join(', ');
}

function parsePropertyDocument(id: string, fields: Record<string, FirestoreValue>): PropertyRecord {
  const propertyCode = normalizePropertyCode(readStringField(fields, 'propertyCode') || id);

  return {
    id,
    propertyCode,
    title: readStringField(fields, 'title') || `Property ${propertyCode}`,
    description: readStringField(fields, 'description') || DEFAULT_DESCRIPTION,
    category: readStringField(fields, 'category'),
    mainCategory: readStringField(fields, 'mainCategory'),
    listingType: readStringField(fields, 'listingType') as PropertyRecord['listingType'],
    propertyType: readStringField(fields, 'propertyType'),
    location: readStringField(fields, 'location'),
    city: readStringField(fields, 'city'),
    state: readStringField(fields, 'state'),
    address: readStringField(fields, 'address'),
    bedrooms: readNumberField(fields, 'bedrooms'),
    bathrooms: readNumberField(fields, 'bathrooms'),
    area: readNumberField(fields, 'area') || readNumberField(fields, 'plotSize'),
    areaUnit: readStringField(fields, 'areaUnit'),
    price: readNumberField(fields, 'price'),
    priceUnit: readStringField(fields, 'priceUnit') as PropertyRecord['priceUnit'],
    images: (fields.images?.arrayValue?.values ?? []).map((image) => {
      if (image.stringValue) return image.stringValue;
      return { url: image.mapValue?.fields?.url?.stringValue || '' };
    }),
    isVerified: readBooleanField(fields, 'isVerified'),
    isFeatured: readBooleanField(fields, 'isFeatured'),
    possessionStatus: readStringField(fields, 'possessionStatus'),
    amenities: readStringArray(fields, 'amenities'),
    createdAt: readStringField(fields, 'createdAt'),
    updatedAt: readStringField(fields, 'updatedAt'),
  };
}

function readPrimaryImageFromProperty(property: PropertyRecord): string {
  for (const image of property.images || []) {
    if (typeof image === 'string' && image.trim()) return absoluteUrl(image.trim());
    if (image && typeof image === 'object' && image.url?.trim()) return absoluteUrl(image.url.trim());
  }

  return '';
}

export async function fetchPropertyByCode(code: string): Promise<PropertyRecord | null> {
  const normalizedCode = normalizePropertyCode(code);
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID ?? 'yuvainfraedge';

  const runQueryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

  const runQueryBody = {
    structuredQuery: {
      from: [{ collectionId: 'properties' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'propertyCode' },
          op: 'EQUAL',
          value: { stringValue: normalizedCode },
        },
      },
      limit: 1,
    },
  };

  const queryResponse = await fetch(runQueryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(runQueryBody),
  });

  if (queryResponse.ok) {
    const results = (await queryResponse.json()) as Array<{ document?: { name?: string; fields?: Record<string, FirestoreValue> } }>;
    const document = results?.[0]?.document;
    if (document?.fields) {
      const id = document.name?.split('/').pop() || normalizedCode;
      return parsePropertyDocument(id, document.fields);
    }
  }

  const docResponse = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/properties/${encodeURIComponent(normalizedCode)}`
  );

  if (!docResponse.ok) return null;

  const document = (await docResponse.json()) as { name?: string; fields?: Record<string, FirestoreValue> };
  if (!document.fields) return null;

  const id = document.name?.split('/').pop() || normalizedCode;
  return parsePropertyDocument(id, document.fields);
}

export function buildPropertyMetadata(property: PropertyRecord): PropertyMetadata {
  const canonicalUrl = canonicalizeUrl(`/property/${encodeURIComponent(property.propertyCode)}`);
  const ogImage = absoluteUrl(`/api/og-image?code=${encodeURIComponent(property.propertyCode)}`);
  const title = buildPropertyTitle(property);
  const description = buildPropertyDescription(property);
  const keywords = buildPropertyKeywords(property);
  const primaryImageUrl = readPrimaryImageFromProperty(property);

  return {
    title,
    description,
    keywords,
    author: SITE_NAME,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    themeColor: '#0f172a',
    language: 'en',
    viewport: 'width=device-width, initial-scale=1.0',
    canonicalUrl,
    ogUrl: canonicalUrl,
    ogType: 'article',
    ogSiteName: SITE_NAME,
    ogLocale: SITE_LOCALE,
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: `${property.title} - ${SITE_NAME}`,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    twitterSite: TWITTER_HANDLE,
    twitterCreator: TWITTER_HANDLE,
    property,
    primaryImageUrl,
  };
}

export function buildPropertyMetaHtml(metadata: PropertyMetadata, appHtml = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="${escapeHtml(metadata.viewport)}" />
    <meta name="robots" content="${escapeHtml(metadata.robots)}" />
    <meta name="language" content="${escapeHtml(metadata.language)}" />
    <meta name="theme-color" content="${escapeHtml(metadata.themeColor)}" />
    <meta name="author" content="${escapeHtml(metadata.author)}" />
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <meta name="keywords" content="${escapeHtml(metadata.keywords)}" />
    <link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />
    <title>${escapeHtml(metadata.title)}</title>

    <meta property="og:type" content="${metadata.ogType}" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:image" content="${escapeHtml(metadata.ogImage)}" />
    <meta property="og:image:width" content="${metadata.ogImageWidth}" />
    <meta property="og:image:height" content="${metadata.ogImageHeight}" />
    <meta property="og:image:alt" content="${escapeHtml(metadata.ogImageAlt)}" />
    <meta property="og:url" content="${escapeHtml(metadata.ogUrl)}" />
    <meta property="og:site_name" content="${escapeHtml(metadata.ogSiteName)}" />
    <meta property="og:locale" content="${escapeHtml(metadata.ogLocale)}" />

    <meta name="twitter:card" content="${metadata.twitterCard}" />
    <meta name="twitter:title" content="${escapeHtml(metadata.twitterTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.twitterDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(metadata.twitterImage)}" />
    <meta name="twitter:url" content="${escapeHtml(metadata.canonicalUrl)}" />
    <meta name="twitter:site" content="${escapeHtml(metadata.twitterSite)}" />
    <meta name="twitter:creator" content="${escapeHtml(metadata.twitterCreator)}" />

    <link rel="icon" type="image/png" href="https://res.cloudinary.com/dswoyink7/image/upload/w_192,h_192,c_fill,q_auto/umy-infra/logo-192.png" sizes="any" />
    <link rel="apple-touch-icon" href="https://res.cloudinary.com/dswoyink7/image/upload/w_192,h_192,c_fill,q_auto/umy-infra/logo-192.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://res.cloudinary.com" />
    <link rel="preconnect" href="https://firestore.googleapis.com" />
    <link rel="dns-prefetch" href="https://apis.google.com" />

    <script type="application/ld+json">${serializeJsonLd(buildPropertyJsonLd(metadata))}</script>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

function buildPropertyJsonLd(metadata: PropertyMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: metadata.property.title,
    description: metadata.description,
    url: metadata.canonicalUrl,
    image: metadata.primaryImageUrl || metadata.ogImage,
    mainEntityOfPage: metadata.canonicalUrl,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: metadata.property.price
      ? {
          '@type': 'Offer',
          price: metadata.property.price,
          priceCurrency: 'INR',
          url: metadata.canonicalUrl,
        }
      : undefined,
  };
}

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildCanonicalSiteUrl(pathname = '/'): string {
  return canonicalizeUrl(pathname);
}
