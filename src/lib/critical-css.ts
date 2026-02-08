/**
 * Critical CSS Utilities
 * - Inline critical above-the-fold CSS
 * - Defer non-critical styles
 * - Improves First Contentful Paint (FCP)
 */

export const injectCriticalCSS = (): void => {
  // Critical CSS for hero section and initial layout
  const criticalStyles = `
    html, body {
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ffffff;
      color: #1f2937;
    }
    
    #root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalStyles;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
};

/**
 * Defers loading of non-critical stylesheets
 */
export const deferNonCriticalCSS = (): void => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  
  links.forEach(link => {
    // Skip if already marked as critical
    if (link.getAttribute('data-critical') === 'true') {
      return;
    }
    
    const href = link.getAttribute('href');
    if (href) {
      // Create a new link with onload to swap rel
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = href;
      newLink.media = 'print'; // Load in background
      newLink.onload = () => {
        newLink.media = 'all'; // Apply when loaded
      };
      
      link.parentNode?.replaceChild(newLink, link);
    }
  });
};

/**
 * Setup performance observer to track metrics
 */
export const setupPerformanceObserver = (): void => {
  if ('PerformanceObserver' in window) {
    try {
      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.debug(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.debug(`LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.debug('Performance Observer not supported');
    }
  }
};
