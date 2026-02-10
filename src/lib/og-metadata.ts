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
  updateMetaTag('twitter:image', image);
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
    if (property.startsWith('og:')) {
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
  baseUrl: string = 'https://umyinfra.in'
) => {
  const shortDescription = description.substring(0, 160);
  const pageUrl = `${baseUrl}/properties/${propertyId}`;

  updateOGMetadata({
    title,
    description: `${address}. ${shortDescription}`,
    image: imageUrl,
    url: pageUrl,
    type: 'object',
  });
};
