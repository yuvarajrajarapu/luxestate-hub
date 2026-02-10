import { NextRequest } from 'next/server';
import { generateHTML } from '../src/entry-server';

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
    
    let metaTags = {};
    
    if (metaResponse.ok) {
      const data = await metaResponse.json();
      metaTags = data.metaTags || {};
    }

    // Generate SSR HTML
    const html = generateHTML(pathname, metaTags);

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
