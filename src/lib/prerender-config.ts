/**
 * Prerender Configuration for Static Site Generation
 * This file defines routes that should be prerendered at build time
 */

export const prerenderRoutes = [
  '/',
  '/properties',
  '/land',
  '/login',
  '/signup',
  '/profile',
];

/**
 * Dynamic routes that need SSR or ISR (Incremental Static Regeneration)
 */
export const dynamicRoutes = [
  {
    path: '/properties/:id',
    revalidate: 3600, // Revalidate every hour
  },
  {
    path: '/land/:id',
    revalidate: 3600,
  },
];

/**
 * Bot detection patterns for prerendering
 */
export const botUserAgents = [
  'bot',
  'crawler',
  'spider',
  'crawling',
  'facebookexternalhit',
  'facebookplatform',
  'twitterbot',
  'whatsapp',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'pinterestbot',
  'redditbot',
  'discordbot',
  'googlebot',
  'bingbot',
  'baiduspider',
  'yandexbot',
  'duckduckbot',
];

/**
 * Check if the request is from a bot/crawler
 */
export function isBot(userAgent: string): boolean {
  return botUserAgents.some(pattern => 
    userAgent.toLowerCase().includes(pattern)
  );
}

/**
 * Routes that should be statically generated
 */
export const staticGenerationConfig = {
  routes: prerenderRoutes,
  exclude: [
    '/admin/**',
    '/dashboard/**',
    '/api/**',
  ],
};
