export interface OGMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'object' | 'article';
}

export const updateOGMetadata = (metadata: OGMetadata) => {
  const { title, description, image, url, type = 'website' } = metadata;

  document.title = title;
  updateMetaTag('title', title);
  updateMetaTag('og:title', title);
  updateMetaTag('twitter:title', title);
  updateMetaTag('description', description);
  updateMetaTag('og:description', description);
  updateMetaTag('twitter:description', description);
  updateMetaTag('og:image', image);
  updateMetaTag('og:image:width', '1200');
  updateMetaTag('og:image:height', '630');
  updateMetaTag('twitter:image', image);
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('og:url', url);
  updateMetaTag('og:type', type);
  updateCanonicalURL(url);
};

const updateMetaTag = (property: string, content: string) => {
  let element = document.querySelector(
    `meta[property="${property}"], meta[name="${property}"]`
  ) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      element.setAttribute('property', property);
    } else {
      element.setAttribute('name', property);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const updateCanonicalURL = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', url);
};

export const setPropertyMetadata = (
  propertyId: string,
  title: string,
  address: string,
  description: string,
  imageUrl: string,
  price?: string,
  propertyType?: string,
  baseUrl: string = 'https://umyinfra.in'
) => {
  const shortDescription = description.substring(0, 160);
  const pageUrl = `${baseUrl}/properties/${propertyId}`;
  
  // Generate dynamic OG image URL using Vercel Edge Function
  const ogImageParams = new URLSearchParams({
    title,
    address,
    ...(price && { price }),
    ...(propertyType && { type: propertyType }),
    ...(imageUrl && { image: imageUrl }),
  });
  
  const dynamicOGImage = `${baseUrl}/api/og-image?${ogImageParams.toString()}`;

  updateOGMetadata({
    title: `${title} - UMY Infra`,
    description: `${address}. ${shortDescription}`,
    image: dynamicOGImage,
    url: pageUrl,
    type: 'object',
  });
};

// Helper to fetch and apply metadata for property pages
export const fetchAndApplyPropertyMetadata = async (
  propertyId: string,
  baseUrl: string = 'https://umyinfra.in'
) => {
  try {
    const response = await fetch(`${baseUrl}/api/property-meta?id=${propertyId}`);
    
    if (response.ok) {
      const data = await response.json();
      const { property, metaTags } = data;
      
      if (metaTags && metaTags.title) {
        updateOGMetadata({
          title: metaTags.title,
          description: metaTags.description,
          image: metaTags['og:image'],
          url: metaTags['og:url'] || metaTags.canonical,
          type: 'object',
        });
      }
      
      return property;
    }
  } catch (error) {
    console.error('Failed to fetch property metadata:', error);
  }
  
  return null;
};
