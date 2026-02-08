/**
 * Advanced Performance Monitoring
 * Tracks key Web Vitals and optimization metrics
 */

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay (deprecated, use INP)
  inp?: number; // Interaction to Next Paint
  ttfb?: number; // Time to First Byte
  domInteractive?: number;
  domComplete?: number;
  loadComplete?: number;
}

let metrics: PerformanceMetrics = {};

/**
 * Measure First Contentful Paint
 */
export const measureFCP = (): void => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
          console.debug(`FCP: ${fcpEntry.startTime.toFixed(2)}ms`);
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Silently fail if not supported
    }
  }
};

/**
 * Measure Largest Contentful Paint
 */
export const measureLCP = (): void => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        console.debug(`LCP: ${metrics.lcp.toFixed(2)}ms`);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Stop observing after 5 seconds (LCP finishes by then)
      setTimeout(() => observer.disconnect(), 5000);
    } catch (e) {
      // Silently fail if not supported
    }
  }
};

/**
 * Measure Cumulative Layout Shift
 */
export const measureCLS = (): void => {
  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metrics.cls = clsValue;
            console.debug(`CLS: ${clsValue.toFixed(3)}`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Stop observing at page unload
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          observer.disconnect();
          console.debug(`Final CLS: ${clsValue.toFixed(3)}`);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } catch (e) {
      // Silently fail if not supported
    }
  }
};

/**
 * Measure Interaction to Next Paint
 */
export const measureINP = (): void => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        metrics.inp = lastEntry.duration;
        console.debug(`INP: ${lastEntry.duration.toFixed(2)}ms`);
      });
      
      observer.observe({ entryTypes: ['event'] });
      
      // Stop observing after 5 seconds
      setTimeout(() => observer.disconnect(), 5000);
    } catch (e) {
      // Silently fail if not supported
    }
  }
};

/**
 * Measure Navigation Timing
 */
export const measureNavigationTiming = (): void => {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    
    metrics.ttfb = timing.responseStart - timing.navigationStart;
    metrics.domInteractive = timing.domInteractive - timing.navigationStart;
    metrics.domComplete = timing.domComplete - timing.navigationStart;
    metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
    
    console.debug(`TTFB: ${metrics.ttfb}ms`);
    console.debug(`DOM Interactive: ${metrics.domInteractive}ms`);
    console.debug(`DOM Complete: ${metrics.domComplete}ms`);
    console.debug(`Load Complete: ${metrics.loadComplete}ms`);
  }
};

/**
 * Initialize all performance monitoring
 */
export const initializePerformanceMonitoring = (): void => {
  // Wait for page to load before measuring some metrics
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      measureNavigationTiming();
    });
  } else {
    measureNavigationTiming();
  }
  
  // Measure Core Web Vitals
  measureFCP();
  measureLCP();
  measureCLS();
  measureINP();
};

/**
 * Get current metrics snapshot
 */
export const getMetrics = (): PerformanceMetrics => {
  return { ...metrics };
};

/**
 * Report metrics to analytics service
 */
export const reportMetrics = (endpoint?: string): void => {
  const metricsSnapshot = getMetrics();
  
  if (endpoint) {
    try {
      // Use sendBeacon for reliable delivery
      const payload = JSON.stringify(metricsSnapshot);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, payload);
      } else {
        // Fallback to fetch
        fetch(endpoint, {
          method: 'POST',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }).catch(() => {
          // Silently fail
        });
      }
    } catch (e) {
      // Silently fail
    }
  } else {
    console.log('Performance Metrics:', metricsSnapshot);
  }
};
