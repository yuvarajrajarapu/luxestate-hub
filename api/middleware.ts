import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
  matcher: ['/properties/:path*', '/land/:path*'],
};

// Bot detection patterns
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'crawling',
  'facebookexternalhit', 'facebookplatform',
  'twitterbot', 'whatsapp', 'linkedinbot',
  'slackbot', 'telegrambot', 'pinterestbot',
  'redditbot', 'discordbot', 'googlebot',
  'bingbot', 'baiduspider', 'yandexbot'
];

function isBot(userAgent: string): boolean {
  return BOT_USER_AGENTS.some(pattern =>
    userAgent.toLowerCase().includes(pattern)
  );
}

// Prerender middleware for dynamic routes
export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Extract property ID from URL
  const propertyMatch = pathname.match(/\/properties\/([^\/]+)/);
  const landMatch = pathname.match(/\/land\/([^\/]+)/);
  const propertyId = propertyMatch?.[1] || landMatch?.[1];

  if (!propertyId) {
    return NextResponse.next();
  }

  // Check if this is a bot/crawler
  const userAgent = request.headers.get('user-agent') || '';
  const botDetected = isBot(userAgent);

  if (botDetected) {
    try {
      const baseUrl = url.origin;
      
      // Fetch property metadata
      const metaResponse = await fetch(`${baseUrl}/api/property-meta?id=${propertyId}`, {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      });

      let metadata = {
        title: `Property ${propertyId} - UMY Infra`,
        description: 'Premium real estate property listing',
        ogImage: `${baseUrl}/api/og-image?title=Property%20Details&propertyId=${propertyId}`,
        url: url.toString(),
      };

      if (metaResponse.ok) {
        const data = await metaResponse.json();
        if (data.metaTags) {
          metadata = {
            title: data.metaTags.title || metadata.title,
            description: data.metaTags.description || metadata.description,
            ogImage: data.metaTags['og:image'] || metadata.ogImage,
            url: data.metaTags['og:url'] || metadata.url,
          };
        }
      }

      // Return prerendered HTML with proper meta tags
      const html = generatePrerenderHTML(metadata);

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          'X-Prerendered': 'true',
        },
      });
    } catch (error) {
      console.error('Prerender error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

function generatePrerenderHTML(metadata: {
  title: string;
  description: string;
  ogImage: string;
  url: string;
}): string {
  const escapedTitle = escapeHtml(metadata.title);
  const escapedDescription = escapeHtml(metadata.description);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapedTitle}</title>
  <meta name="description" content="${escapedDescription}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${metadata.url}" />
  <meta property="og:title" content="${escapedTitle}" />
  <meta property="og:description" content="${escapedDescription}" />
  <meta property="og:image" content="${metadata.ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="UMY Infra" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${metadata.url}" />
  <meta name="twitter:title" content="${escapedTitle}" />
  <meta name="twitter:description" content="${escapedDescription}" />
  <meta name="twitter:image" content="${metadata.ogImage}" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${metadata.url}" />
  
  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://res.cloudinary.com" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="https://res.cloudinary.com/dswoyink7/image/upload/w_192,h_192,c_fill,q_auto/umy-infra/logo-192.png" />
  
  <script type="module" crossorigin src="/src/main.tsx"></script>
</head>
<body>
  <div id="root"></div>
  <noscript>
    <h1>${escapedTitle}</h1>
    <p>${escapedDescription}</p>
    <p>Please enable JavaScript to view this property listing.</p>
  </noscript>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
