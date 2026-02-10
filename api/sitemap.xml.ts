import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const SITE_URL = 'https://umyinfra.in';
const FIREBASE_PROJECT_ID = 'umy-infra';

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Fetch properties from Firestore
 */
async function fetchProperties(): Promise<any[]> {
  try {
    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      console.warn('FIREBASE_API_KEY not set, returning empty properties');
      return [];
    }

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/properties?pageSize=1000`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch properties from Firestore');
      return [];
    }

    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

/**
 * Extract property data from Firestore document
 */
function extractPropertyData(doc: any): any | null {
  try {
    if (!doc.name || !doc.fields) return null;

    const id = doc.name.split('/').pop();
    const fields = doc.fields;

    return {
      id,
      title: fields.title?.stringValue || '',
      active: fields.active?.booleanValue !== false,
      updatedAt: doc.updateTime || new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Generate sitemap XML
 */
function generateSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      entry => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Main handler
 */
export default async function handler(request: NextRequest) {
  try {
    const entries: SitemapEntry[] = [];
    const today = getTodayDate();

    // Static pages (highest priority)
    entries.push({
      loc: `${SITE_URL}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
    });

    // Category pages
    const categories = ['sale', 'rent', 'lease'];
    for (const category of categories) {
      entries.push({
        loc: `${SITE_URL}/properties?type=${category}`,
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9,
      });
    }

    // Other static pages
    entries.push({
      loc: `${SITE_URL}/profile`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
    });

    // Dynamic property pages
    const properties = await fetchProperties();
    const activeProperties = properties
      .map(extractPropertyData)
      .filter((p): p is any => p !== null && p.active);

    console.log(`Found ${activeProperties.length} active properties for sitemap`);

    for (const property of activeProperties) {
      entries.push({
        loc: `${SITE_URL}/properties/${property.id}`,
        lastmod: property.updatedAt.split('T')[0],
        changefreq: 'weekly',
        priority: 0.8,
      });
    }

    // Common cities (location hierarchy)
    const cities = [
      'hyderabad',
      'kakinada',
      'vijayawada',
      'visakhapatnam',
      'bangalore',
      'pune',
      'mumbai',
      'delhi',
      'kolkata',
      'chennai',
    ];

    for (const city of cities) {
      entries.push({
        loc: `${SITE_URL}/properties?city=${encodeURIComponent(city)}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.7,
      });
    }

    const xml = generateSitemapXml(entries);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);

    // Return minimal valid sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${getTodayDate()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}
