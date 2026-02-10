import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string, context: any = {}) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}

export function generateHTML(url: string, metaTags: Record<string, string> = {}) {
  const appHtml = render(url);
  
  const {
    title = 'UMY Infra - Premium Real Estate',
    description = 'Discover premium properties for buy, rent, and lease',
    'og:title': ogTitle = title,
    'og:description': ogDescription = description,
    'og:image': ogImage = '',
    'og:url': ogUrl = '',
    'og:type': ogType = 'website',
    'twitter:card': twitterCard = 'summary_large_image',
    'twitter:title': twitterTitle = title,
    'twitter:description': twitterDescription = description,
    'twitter:image': twitterImage = ogImage,
    canonical = ogUrl,
  } = metaTags;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://res.cloudinary.com" />
    <link rel="preconnect" href="https://firestore.googleapis.com" />
    <link rel="dns-prefetch" href="https://apis.google.com" />
    
    <link rel="icon" type="image/png" href="https://res.cloudinary.com/dswoyink7/image/upload/w_192,h_192,c_fill,q_auto/umy-infra/logo-192.png" sizes="any" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    
    <title>${title}</title>
    <meta name="description" content="${description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${ogType}" />
    ${ogUrl ? `<meta property="og:url" content="${ogUrl}" />` : ''}
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
    ${ogImage ? `<meta property="og:image:width" content="1200" />` : ''}
    ${ogImage ? `<meta property="og:image:height" content="630" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="${twitterCard}" />
    ${ogUrl ? `<meta name="twitter:url" content="${ogUrl}" />` : ''}
    <meta name="twitter:title" content="${twitterTitle}" />
    <meta name="twitter:description" content="${twitterDescription}" />
    ${twitterImage ? `<meta name="twitter:image" content="${twitterImage}" />` : ''}
    
    ${canonical ? `<link rel="canonical" href="${canonical}" />` : ''}
    
    <link rel="stylesheet" href="/src/index.css" />
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}
