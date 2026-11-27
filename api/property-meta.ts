import { buildPropertyMetadata, fetchPropertyByCode } from './_shared/property-metadata.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code')?.trim() || searchParams.get('id')?.trim() || '';

  if (!code) {
    return Response.json({ error: 'Property code or ID is required' }, { status: 400 });
  }

  const property = await fetchPropertyByCode(code);

  if (!property) {
    return Response.json({ error: 'Property not found' }, { status: 404 });
  }

  const metadata = buildPropertyMetadata(property);

  return Response.json(
    {
      property,
      metadata,
      metaTags: {
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        author: metadata.author,
        robots: metadata.robots,
        canonical: metadata.canonicalUrl,
        'og:title': metadata.title,
        'og:description': metadata.description,
        'og:image': metadata.ogImage,
        'og:image:width': metadata.ogImageWidth,
        'og:image:height': metadata.ogImageHeight,
        'og:type': metadata.ogType,
        'og:url': metadata.ogUrl,
        'og:site_name': metadata.ogSiteName,
        'og:locale': metadata.ogLocale,
        'twitter:card': metadata.twitterCard,
        'twitter:title': metadata.twitterTitle,
        'twitter:description': metadata.twitterDescription,
        'twitter:image': metadata.twitterImage,
        'twitter:site': metadata.twitterSite,
        'twitter:creator': metadata.twitterCreator,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
