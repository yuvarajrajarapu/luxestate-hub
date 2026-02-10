/**
 * Structured Data Generator for JSON-LD
 * Generates schema.org compatible JSON-LD for SEO
 */

export interface PropertySchemaData {
  id: string;
  name: string;
  description: string;
  price?: number;
  priceCurrency?: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  image?: string[];
  propertyType?: string;
  numberOfRooms?: number;
  areaSize?: number;
  url: string;
}

export interface OrganizationSchemaData {
  name: string;
  logo: string;
  sameAs: string[];
  address: string;
  telephone: string;
  email: string;
  url: string;
}

/**
 * Generate RealEstateListing JSON-LD
 */
export function generateRealEstateListingSchema(property: PropertySchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.name,
    description: property.description,
    url: property.url,
    image: property.image || [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.postalCode || '',
      addressCountry: 'IN',
    },
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    } : undefined,
    price: property.price ? {
      '@type': 'PriceSpecification',
      priceCurrency: property.priceCurrency || 'INR',
      price: property.price,
    } : undefined,
    numberOfRooms: property.numberOfRooms,
    floorSize: property.areaSize ? {
      '@type': 'QuantitativeValue',
      unitCode: 'SQM',
      value: property.areaSize,
    } : undefined,
    propertyType: property.propertyType || 'Residence',
  };
}

/**
 * Generate Residence JSON-LD
 */
export function generateResidenceSchema(property: PropertySchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: property.name,
    description: property.description,
    url: property.url,
    image: property.image || [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.postalCode || '',
      addressCountry: 'IN',
    },
    numberOfRooms: property.numberOfRooms,
  };
}

/**
 * Generate Place JSON-LD
 */
export function generatePlaceSchema(city: string, state: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${city}, ${state}`,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state,
      addressCountry: 'IN',
    },
  };
}

/**
 * Generate LocalBusiness JSON-LD
 */
export function generateLocalBusinessSchema(org: OrganizationSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': org.url,
    name: org.name,
    image: org.logo,
    description: 'Premium Real Estate Portal',
    url: org.url,
    telephone: org.telephone,
    email: org.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: org.address,
      addressCountry: 'IN',
    },
    sameAs: org.sameAs,
    priceRange: '₹₹₹',
  };
}

/**
 * Generate Organization JSON-LD (for head)
 */
export function generateOrganizationSchema(org: OrganizationSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    logo: org.logo,
    url: org.url,
    sameAs: org.sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      telephone: org.telephone,
      email: org.email,
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Inject JSON-LD script into head
 */
export function injectJsonLd(schema: any, id: string = 'json-ld-schema') {
  if (typeof document === 'undefined') return;

  // Remove existing schema if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create and inject script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
