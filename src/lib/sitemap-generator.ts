/**
 * Dynamic Sitemap Generator for Property URLs
 * This generates sitemap.xml with property-specific URLs
 */

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: string[];
}

/**
 * Generate sitemap.xml content
 */
export function generateSitemap(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlset = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`;

  const urlElements = entries.map(entry => {
    let url = `  <url>
    <loc>${escapeXml(entry.loc)}</loc>`;
    
    if (entry.lastmod) {
      url += `\n    <lastmod>${entry.lastmod}</lastmod>`;
    }
    if (entry.changefreq) {
      url += `\n    <changefreq>${entry.changefreq}</changefreq>`;
    }
    if (entry.priority !== undefined) {
      url += `\n    <priority>${entry.priority}</priority>`;
    }
    if (entry.images && entry.images.length > 0) {
      url += entry.images.map(img => `\n    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
    </image:image>`).join('');
    }
    url += '\n  </url>';
    return url;
  }).join('\n');

  return `${xmlHeader}\n${urlset}\n${urlElements}\n</urlset>`;
}

/**
 * Static sitemap entries (homepage, category pages)
 */
export function getStaticSitemapEntries(): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      loc: 'https://umyinfra.in/',
      lastmod: today,
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      loc: 'https://umyinfra.in/properties',
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: 'https://umyinfra.in/properties?type=sale',
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: 'https://umyinfra.in/properties?type=rent',
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: 'https://umyinfra.in/properties?type=lease',
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: 'https://umyinfra.in/land',
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8,
    },
  ];
}

/**
 * Generate property-specific sitemap entries
 */
export function generatePropertySitemapEntries(
  properties: Array<{
    id: string;
    title: string;
    city: string;
    images?: string[];
    updatedAt?: string;
  }>
): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];
  
  return properties.map(property => ({
    loc: `https://umyinfra.in/properties/${property.id}`,
    lastmod: property.updatedAt?.split('T')[0] || today,
    changefreq: 'weekly' as const,
    priority: 0.7,
    images: property.images || [],
  }));
}

/**
 * Generate city-based sitemap entries
 */
export function generateCitySitemapEntries(
  cities: Array<{
    name: string;
    slug: string;
    propertyCount?: number;
  }>
): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];
  
  return cities.map(city => ({
    loc: `https://umyinfra.in/properties/${city.slug}`,
    lastmod: today,
    changefreq: 'daily' as const,
    priority: city.propertyCount && city.propertyCount > 10 ? 0.8 : 0.6,
  }));
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Get dynamic sitemap entries from Firebase/Firestore
 * This should be called from an API endpoint
 */
export async function getDynamicSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    // This would fetch from Firestore in a real implementation
    // For now, return static entries
    const staticEntries = getStaticSitemapEntries();
    return staticEntries;
  } catch (error) {
    console.error('Error fetching dynamic sitemap entries:', error);
    return getStaticSitemapEntries();
  }
}
