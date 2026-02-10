import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Main SSR handler for property pages
export default async function handler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Extract property ID
    const match = pathname.match(/\/properties\/([^\/]+)/);
    const propertyId = match?.[1];

    if (!propertyId) {
      return new Response('Not found', { status: 404 });
    }

    // Fetch property metadata
    const metaResponse = await fetch(`${url.origin}/api/property-meta?id=${propertyId}`);
    
    let metadata = {
      title: `Property ${propertyId} - UMY Infra`,
      description: 'Premium real estate property listing',
      ogImage: `${url.origin}/api/og-image?title=Property&id=${propertyId}`,
    };
    
    if (metaResponse.ok) {
      const data = await metaResponse.json();
      if (data.metaTags) {
        metadata = {
          title: data.metaTags.title || metadata.title,
          description: data.metaTags.description || metadata.description,
          ogImage: data.metaTags['og:image'] || metadata.ogImage,
        };
      }
    }

    // Generate static HTML
    const html = generateStaticHTML(pathname, metadata);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('SSR Error:', error);
    
    // Fallback to client-side rendering
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UMY Infra - Premium Real Estate</title>
    <meta http-equiv="refresh" content="0;url=${req.url}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }
}

function generateStaticHTML(pathname: string, metadata: {title: string, description: string, ogImage: string}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://res.cloudinary.com" />
    <link rel="icon" type="image/png" href="https://res.cloudinary.com/dswoyink7/image/upload/w_192,h_192,c_fill,q_auto/umy-infra/logo-192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>${metadata.title}</title>
    <meta name="description" content="${metadata.description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${metadata.title}" />
    <meta property="og:description" content="${metadata.description}" />
    <meta property="og:image" content="${metadata.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${metadata.title}" />
    <meta name="twitter:description" content="${metadata.description}" />
    <meta name="twitter:image" content="${metadata.ogImage}" />
    
    <link rel="stylesheet" href="/src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}
