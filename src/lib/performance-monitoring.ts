/**
 * Performance Monitoring & Analytics
 * Tracks Core Web Vitals and application metrics
 */

// Core Web Vitals
export interface WebVitals {
  CLS: number; // Cumulative Layout Shift
  FID: number; // First Input Delay
  LCP: number; // Largest Contentful Paint
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  // Observe Core Web Vitals using PerformanceObserver
  if ('PerformanceObserver' in window) {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingDuration);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          console.log('CLS:', clsValue);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  const metrics = {
    pageLoadTime: 0,
    resourcesLoaded: 0,
    imageLoadTime: 0,
    scriptLoadTime: 0,
  };

  if ('performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    metrics.pageLoadTime = pageLoadTime;

    // Get resource timings
    const resources = window.performance.getEntriesByType('resource');
    metrics.resourcesLoaded = resources.length;

    // Separate by type
    const images = resources.filter(r => r.initiatorType === 'img');
    const scripts = resources.filter(r => r.initiatorType === 'script');

    if (images.length > 0) {
      metrics.imageLoadTime = images.reduce((sum, img) => sum + img.duration, 0) / images.length;
    }

    if (scripts.length > 0) {
      metrics.scriptLoadTime = scripts.reduce((sum, script) => sum + script.duration, 0) / scripts.length;
    }
  }

  return metrics;
}

/**
 * Report performance metrics
 */
export function reportPerformanceMetrics() {
  const metrics = getPerformanceMetrics();
  console.log('📊 Performance Metrics:');
  console.log(`  Page Load Time: ${metrics.pageLoadTime}ms`);
  console.log(`  Resources Loaded: ${metrics.resourcesLoaded}`);
  console.log(`  Avg Image Load Time: ${metrics.imageLoadTime.toFixed(2)}ms`);
  console.log(`  Avg Script Load Time: ${metrics.scriptLoadTime.toFixed(2)}ms`);
  
  return metrics;
}

/**
 * Monitor image load performance
 */
export function monitorImagePerformance(imageSrc: string): Promise<{
  src: string;
  loadTime: number;
  size: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const startTime = performance.now();

    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve({
        src: imageSrc,
        loadTime,
        size: img.naturalWidth * img.naturalHeight,
      });
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageSrc}`));
    };

    img.src = imageSrc;
  });
}

/**
 * Monitor property cards rendering performance
 */
export function monitorPropertyCardRendering(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint') {
        console.log(`${entry.name}: ${entry.startTime}ms`);
      }
    }
  });

  observer.observe({ entryTypes: ['paint', 'measure'] });
}

/**
 * Log performance issue
 */
export function logPerformanceIssue(
  component: string,
  metric: string,
  value: number,
  threshold: number
) {
  if (value > threshold) {
    console.warn(`⚠️ Performance Issue: ${component} - ${metric} (${value.toFixed(2)}ms)`);
  }
}

/**
 * Initialize all monitoring
 */
export function initAllMonitoring() {
  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPerformanceMonitoring();
      setTimeout(() => reportPerformanceMetrics(), 3000);
    });
  } else {
    initPerformanceMonitoring();
    reportPerformanceMetrics();
  }
}

export default {
  initPerformanceMonitoring,
  getPerformanceMetrics,
  reportPerformanceMetrics,
  monitorImagePerformance,
  monitorPropertyCardRendering,
  logPerformanceIssue,
  initAllMonitoring,
};
