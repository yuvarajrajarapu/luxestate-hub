export const config = {
  runtime: 'edge',
};

interface PropertyData {
  id: string;
  title: string;
  description: string;
  address: string;
  price: string;
  propertyType: string;
  imageUrl: string;
}

// Firebase REST API endpoint
const FIREBASE_PROJECT_ID = 'umy-infra';
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || '';

function jsonResponse(data: unknown, options: { status?: number; headers?: Record<string, string> } = {}): Response {
  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('id');

    if (!propertyId) {
      return jsonResponse({ error: 'Property ID is required' }, { status: 400 });
    }

    // Fetch property data from Firestore
    const propertyData = await fetchPropertyData(propertyId);

    if (!propertyData) {
      return jsonResponse({ error: 'Property not found' }, { status: 404 });
    }

    // Generate meta tags
    const metaTags = generateMetaTags(propertyData, req.url);

    return jsonResponse(
      { property: propertyData, metaTags },
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    console.error('Error fetching property data:', error);
    return jsonResponse({ error: 'Internal server error', message: error.message }, { status: 500 });
  }
}

async function fetchPropertyData(propertyId: string): Promise<PropertyData | null> {
  try {
    // Use Firebase REST API to fetch property data
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/properties/${propertyId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Firebase fetch failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Transform Firestore document to PropertyData
    const fields = data.fields || {};
    
    return {
      id: propertyId,
      title: fields.title?.stringValue || 'Property Listing',
      description: fields.description?.stringValue || '',
      address: fields.address?.stringValue || '',
      price: fields.price?.stringValue || fields.totalPrice?.stringValue || '',
      propertyType: fields.propertyType?.stringValue || '',
      imageUrl: fields.imageUrl?.stringValue || fields.images?.arrayValue?.values?.[0]?.stringValue || '',
    };
  } catch (error) {
    console.error('Error fetching from Firestore:', error);
    return null;
  }
}

function generateMetaTags(property: PropertyData, requestUrl: string): Record<string, string> {
  const baseUrl = new URL(requestUrl).origin;
  const propertyUrl = `${baseUrl}/properties/${property.id}`;
  
  // Generate OG image URL
  const ogImageParams = new URLSearchParams({
    title: property.title,
    address: property.address,
    price: property.price,
    type: property.propertyType,
    ...(property.imageUrl && { image: property.imageUrl }),
  });
  
  const ogImageUrl = `${baseUrl}/api/og-image?${ogImageParams.toString()}`;
  
  const description = property.description.substring(0, 160) || 
    `${property.propertyType} in ${property.address}. Price: ${property.price}`;

  return {
    title: `${property.title} - UMY Infra`,
    description,
    'og:title': property.title,
    'og:description': description,
    'og:image': ogImageUrl,
    'og:url': propertyUrl,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': property.title,
    'twitter:description': description,
    'twitter:image': ogImageUrl,
    canonical: propertyUrl,
  };
}
