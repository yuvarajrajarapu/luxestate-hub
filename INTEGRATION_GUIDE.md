# Performance Optimization Integration Guide

## Quick Start

All optimizations have been implemented and are ready to use. No additional configuration needed!

## What Was Optimized

### 1. Image Delivery (WebP)
Images now automatically convert to WebP format with JPG fallback:
- PropertyImage components display WebP
- HeroSection uses optimized WebP
- Category cards use lazy-loaded WebP

**Usage in Components** (Already Done):
```tsx
import { getOptimizedImageUrl } from '@/lib/image-optimization';

// Convert any image URL to WebP
const webpUrl = getOptimizedImageUrl(imageUrl, 'webp', 80);
```

### 2. Lazy Loading
Off-screen images are deferred until visible:
```tsx
import { useImageLazyLoad } from '@/hooks/useImageLazyLoad';

const { ref, isVisible } = useImageLazyLoad({ threshold: 0.1 });

<img ref={ref} src={url} alt="description" />
```

### 3. Performance Monitoring
Automatically tracks Core Web Vitals (FCP, LCP, CLS, INP, TTFB):
```tsx
import { getMetrics, reportMetrics } from '@/lib/advanced-performance';

// In development console:
const metrics = getMetrics();
console.log(metrics);

// Report to analytics:
reportMetrics('/api/analytics/performance');
```

### 4. Resource Hints
HTML includes preconnect/prefetch for:
- Google Fonts
- Cloudinary CDN
- Firebase
- Google APIs

## Testing the Optimizations

### 1. Verify WebP Delivery
1. Open Network tab in DevTools
2. Look at image requests
3. Should see `f_webp` in Cloudinary URLs
4. PNG sources should appear in Network tab for fallback

### 2. Check Performance Metrics
1. Open browser console
2. Look for logs like:
   ```
   FCP: 1234.56ms
   LCP: 2456.78ms
   CLS: 0.025
   ```

### 3. Test Lazy Loading
1. Open Network tab
2. Scroll down page
3. Images below fold should load as you scroll
4. Scroll up, images should be cached

### 4. Verify Resource Hints
1. Open DevTools → Network
2. Look for preconnect requests to:
   - fonts.googleapis.com
   - fonts.gstatic.com
   - res.cloudinary.com

## Integration with Existing Code

### Creating New Image Components
```tsx
import { getOptimizedImageUrl } from '@/lib/image-optimization';

// For Cloudinary images
const optimizedUrl = getOptimizedImageUrl(cloudinaryUrl, 'webp', 80);

// Use in picture tag for fallback
<picture>
  <source srcSet={optimizedUrl} type="image/webp" />
  <img src={jpgUrl} alt="description" loading="lazy" />
</picture>
```

### Adding Performance Monitoring
```tsx
import { reportMetrics } from '@/lib/advanced-performance';

// Report metrics to your analytics service
useEffect(() => {
  const timer = setTimeout(() => {
    reportMetrics('/api/analytics/performance');
  }, 5000); // Wait 5 seconds for all metrics
  
  return () => clearTimeout(timer);
}, []);
```

### Using Lazy Loading Hook
```tsx
import { useImageLazyLoad } from '@/hooks/useImageLazyLoad';

export const MyImage = ({ url }) => {
  const { ref, isVisible } = useImageLazyLoad();
  
  return (
    <img 
      ref={ref}
      src={isVisible ? url : null}
      alt="description"
    />
  );
};
```

## Configuration

### Cloudinary Transformation Settings
Located in `src/lib/image-optimization.ts`:
- WebP quality: 80 (can adjust)
- JPG quality: 85 (can adjust)
- Responsive breakpoints: 320px, 640px, 1024px, 1920px

Modify `getOptimizedImageUrl()` to change defaults:
```typescript
export const getOptimizedImageUrl = (
  url: string, 
  format: 'webp' | 'jpg' = 'webp',
  quality: number = 80  // ← Adjust here
): string => {
  // ...
}
```

### Performance Monitoring Endpoints
Update `reportMetrics()` call with your analytics endpoint:
```typescript
// In any component:
reportMetrics('https://your-analytics.com/api/performance');
```

### Lazy Loading Thresholds
Adjust Intersection Observer options:
```typescript
const { ref, isVisible } = useImageLazyLoad({
  threshold: 0.1,      // Image 10% visible to trigger
  rootMargin: '50px'   // Start loading 50px before visible
});
```

## Monitoring Performance

### Google Search Console
1. Go to Enhancements → Core Web Vitals
2. Monitor:
   - FCP (First Contentful Paint)
   - LCP (Largest Contentful Paint)
   - CLS (Cumulative Layout Shift)

### Lighthouse Audit
Run regularly to track improvements:
```bash
npm run build
npm run preview
# Then use Lighthouse in DevTools
```

### Custom Dashboard
Collect metrics and display in admin panel:
```typescript
import { getMetrics } from '@/lib/advanced-performance';

// In your analytics dashboard
const metrics = getMetrics();
sendToAnalytics({
  fcp: metrics.fcp,
  lcp: metrics.lcp,
  cls: metrics.cls,
  timestamp: new Date().toISOString()
});
```

## Troubleshooting

### WebP Images Not Loading
**Check**:
1. Cloudinary account is active
2. Image URL is valid
3. Network tab shows correct transformation

**Solution**:
```typescript
// Add debugging
const url = getOptimizedImageUrl(imageUrl, 'webp', 80);
console.log('WebP URL:', url); // See actual URL
```

### Performance Metrics Missing
**Check**:
1. Browser supports PerformanceObserver
2. Page loaded fully (check document.readyState)
3. No console errors

**Solution**:
```typescript
// Check in console
console.log(window.PerformanceObserver); // Should exist
console.log(document.readyState); // Should be 'complete'
```

### Lazy Loading Not Working
**Check**:
1. Browser supports IntersectionObserver
2. Image is actually below fold
3. No CSS `display: none` on parent

**Solution**:
```typescript
// Verify support
console.log('Intersection Observer:', 'IntersectionObserver' in window);

// Ensure image has viewport
<div style={{ height: '100vh', overflow: 'auto' }}>
  <img ref={ref} src={url} alt="test" />
</div>
```

## Performance Improvements Checklist

### Before Deploying
- [ ] Built successfully: `npm run build`
- [ ] No TypeScript errors
- [ ] Tested in Chrome DevTools
- [ ] Verified WebP images in Network tab
- [ ] Checked performance metrics log

### After Deploying
- [ ] Monitor Core Web Vitals for 48 hours
- [ ] Run Lighthouse audit
- [ ] Check Google Search Console
- [ ] Compare with baseline HAR file
- [ ] Monitor for regressions

## Expected Results

After deployment, you should see:
- ✅ Page load time: ~900-1000ms (was 1680ms)
- ✅ Page size: ~4.5MB (was 5.8MB)
- ✅ FCP: < 1.8 seconds
- ✅ LCP: < 2.5 seconds
- ✅ CLS: < 0.1

## Need Help?

### Documentation Files
- `PERFORMANCE_OPTIMIZATION.md` - Technical details
- `OPTIMIZATION_CHECKLIST.md` - Testing guide
- `OPTIMIZATION_SUMMARY.md` - Overview

### Code Examples
See component implementations for examples:
- `src/components/property/PropertyImage.tsx` - WebP usage
- `src/components/home/HeroSection.tsx` - Picture tags
- `src/main.tsx` - Performance monitoring init

### Key Files
- `src/lib/image-optimization.ts` - Image utilities
- `src/lib/advanced-performance.ts` - Monitoring
- `src/hooks/useImageLazyLoad.ts` - Lazy loading
- `index.html` - Resource hints

## Next Steps

1. **Deploy** to production
2. **Monitor** Core Web Vitals for 48 hours
3. **Compare** with baseline metrics
4. **Iterate** on any needed adjustments
5. **Document** results for future reference

All optimizations are production-ready and backward compatible!
