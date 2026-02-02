# ⚡ Quick Optimization Reference Guide

## 🎯 For Developers

### Using the PropertyImage Component
```tsx
// Import
import PropertyImage from '@/components/property/PropertyImage';

// Use
<PropertyImage 
  images={property.images} 
  title={property.title}
  className="w-full h-full"
/>
```

### Checking Performance
```tsx
// In any component or console
import { reportPerformanceMetrics } from '@/lib/performance-monitoring';
reportPerformanceMetrics();
```

### Diagnosing Image Issues
```tsx
// In browser console
import { printDiagnosticReport } from '@/lib/property-image-loader';
await printDiagnosticReport();
```

---

## 🏗️ For Build/Deployment

### Analyze Production Build Size
```bash
npm run build
npm run analyze-build
```

### Dev & Build Commands
```bash
npm run dev          # Start development server
npm run build        # Production build with optimizations
npm run build:dev    # Dev build with sourcemaps
npm run preview      # Preview production build locally
npm run lint         # Check code quality
npm run analyze-build # Analyze bundle size
```

---

## 📊 Key Metrics to Monitor

1. **Bundle Size Target:** < 3MB
2. **Initial Load Time:** < 2 seconds
3. **Image Load Time:** < 500ms
4. **Time to Interactive:** < 3 seconds

---

## 🚀 Performance Features Enabled

- ✅ **Gzip Compression** - Automatic for production builds
- ✅ **Code Splitting** - By vendor (React, Firebase, UI, etc.)
- ✅ **Image Optimization** - Cloudinary URL auto-optimization
- ✅ **Lazy Loading** - Images load on demand
- ✅ **Error Handling** - Graceful fallbacks for missing images
- ✅ **Performance Monitoring** - Core Web Vitals tracking

---

## 📝 Common Tasks

### Add New Route with Code Splitting
```tsx
// pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>;
}

// In App.tsx
import { lazy, Suspense } from 'react';

const NewPage = lazy(() => import('@/pages/NewPage'));

// In router
<Route path="/new" element={
  <Suspense fallback={<Loading />}>
    <NewPage />
  </Suspense>
} />
```

### Improve Image Loading
All properties now use the `PropertyImage` component which handles:
- Cloudinary URL optimization
- Failed image fallbacks
- Lazy loading
- Error states

### Analyze What's Slowing Down Build
```bash
npm run build
npm run analyze-build
# See the detailed report
```

---

## 🔧 Configuration Files Reference

| File | Purpose | Key Settings |
|------|---------|--------------|
| `vite.config.ts` | Build config | Gzip, code splitting, minification |
| `package.json` | Dependencies | Scripts, packages, versions |
| `tsconfig.json` | TypeScript | Compilation rules |
| `src/lib/cloudinary.ts` | Image upload | Cloud name, upload preset |
| `src/lib/performance-monitoring.ts` | Metrics | Core Web Vitals tracking |

---

## ❓ FAQ

**Q: Images still not showing?**
A: Check `printDiagnosticReport()` in console, verify Firestore structure

**Q: Bundle too large?**
A: Run `npm run analyze-build` to identify large chunks

**Q: App feels slow?**
A: Check performance metrics with `reportPerformanceMetrics()`

**Q: How to add new images?**
A: Use MediaUploader in PropertyForm, uploads to Cloudinary automatically

---

## 📚 Full Documentation

See `OPTIMIZATION_COMPLETE.md` for detailed information about:
- All optimizations applied
- Expected performance improvements
- File-by-file changes
- Troubleshooting guide
- Future optimization opportunities

---

## 🎓 Learning Resources

- [Vite Optimization Guide](https://vitejs.dev/guide/features.html)
- [React Performance](https://react.dev/reference/react/useMemo)
- [Web Vitals](https://web.dev/vitals/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**Last Updated:** February 2, 2026
**Status:** ✅ All Optimizations Complete
