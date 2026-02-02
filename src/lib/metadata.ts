/**
 * Metadata utilities for dynamic Open Graph and social media tags
 * Ensures proper SEO and social sharing across platforms
 */

export interface MetadataConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'property';
  author?: string;
  publishDate?: string;
  twitterHandle?: string;
}

const SITE_NAME = 'UMY infra';
const SITE_URL = 'https://www.umyinfra.in';
const DEFAULT_DESCRIPTION = 'Premium real estate platform for buying, renting, and leasing properties';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const TWITTER_HANDLE = '@umyinfra';

/**
 * Generate complete metadata config with fallbacks
 */
export const generateMetadata = (config: Partial<MetadataConfig>): MetadataConfig => {
  return {
    title: config.title || SITE_NAME,
    description: config.description || DEFAULT_DESCRIPTION,
    image: config.image || DEFAULT_IMAGE,
    url: config.url || SITE_URL,
    type: config.type || 'website',
    author: config.author || SITE_NAME,
    twitterHandle: config.twitterHandle || TWITTER_HANDLE,
    publishDate: config.publishDate,
  };
};

/**
 * Format property metadata for social sharing
 * Extracts key information for compact description
 */
export const generatePropertyMetadata = (property: any): MetadataConfig => {
  const priceText = property.price ? `₹${(property.price / 100000).toFixed(1)}L` : '';
  const categoryText = property.category?.replace(/-/g, ' ') || 'Property';
  const locationText = property.location || property.area || '';
  
  const description = [
    categoryText.charAt(0).toUpperCase() + categoryText.slice(1),
    `${property.bedrooms ? property.bedrooms + ' BHK' : ''}`,
    locationText,
    priceText,
  ]
    .filter(Boolean)
    .join(' • ');

  const imageUrl = property.images?.[0] || property.featured_image || DEFAULT_IMAGE;

  return generateMetadata({
    title: `${property.title} - ${SITE_NAME}`,
    description: description || property.description?.substring(0, 160),
    image: imageUrl,
    url: `${SITE_URL}/property/${property.id}`,
    type: 'property',
    author: property.contactName || SITE_NAME,
    publishDate: property.createdAt,
  });
};

/**
 * Generate listing page metadata
 */
export const generateListingPageMetadata = (
  category: string,
  type?: string
): MetadataConfig => {
  const categoryName = category?.replace(/-/g, ' ') || 'Properties';
  const title = type ? `${categoryName} for ${type}` : categoryName;

  return generateMetadata({
    title: `${title} - UMY infra`,
    description: `Browse premium ${title.toLowerCase()} on UMY infra. Find your perfect property today.`,
    url: `${SITE_URL}/properties?category=${category}${type ? `&type=${type}` : ''}`,
    type: 'website',
  });
};

/**
 * Generate page metadata with canonical URL
 */
export const generatePageMetadata = (
  title: string,
  description: string,
  pathname: string
): MetadataConfig => {
  return generateMetadata({
    title: `${title} - ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${pathname}`,
    type: 'website',
  });
};

/**
 * Sanitize text for meta descriptions (max 160 chars)
 */
export const sanitizeMetaDescription = (text: string | undefined, maxLength = 160): string => {
  if (!text) return DEFAULT_DESCRIPTION;
  return text.replace(/\n/g, ' ').substring(0, maxLength).trim();
};

/**
 * Extract primary image URL with fallback
 */
export const getPrimaryImage = (images: any[] | undefined): string => {
  if (Array.isArray(images) && images.length > 0) {
    const firstImage = images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage.url || DEFAULT_IMAGE;
  }
  return DEFAULT_IMAGE;
};

/**
 * Generate Twitter card specific metadata
 */
export const generateTwitterMetadata = (metadata: MetadataConfig) => {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': metadata.title,
    'twitter:description': metadata.description,
    'twitter:image': metadata.image,
    'twitter:creator': metadata.twitterHandle,
  };
};

/**
 * Generate Open Graph metadata object
 */
export const generateOGMetadata = (metadata: MetadataConfig) => {
  return {
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:image': metadata.image,
    'og:url': metadata.url,
    'og:type': metadata.type,
    'og:site_name': SITE_NAME,
  };
};

/**
 * Get site URL for canonical links
 */
export const getSiteURL = (): string => SITE_URL;
