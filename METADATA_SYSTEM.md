# Dynamic Open Graph & Social Metadata System

## Overview

This implementation provides a comprehensive, scalable solution for managing dynamic Open Graph (OG) and social media metadata across the UMY infra platform. Metadata is automatically generated per page/property based on actual content, ensuring proper previews on WhatsApp, Facebook, LinkedIn, Twitter, and other social platforms.

## Architecture

### 1. **Core Utilities** (`src/lib/metadata.ts`)
Contains all metadata generation logic and utility functions:

- `generateMetadata()` - Base metadata generator with fallbacks
- `generatePropertyMetadata()` - Property-specific metadata with price, location, BHK, etc.
- `generateListingPageMetadata()` - Category/type listing pages
- `generatePageMetadata()` - Generic page metadata
- `sanitizeMetaDescription()` - Enforces 160-char limit for descriptions
- `getPrimaryImage()` - Image extraction with fallbacks
- `generateOGMetadata()` / `generateTwitterMetadata()` - Format metadata for tags

### 2. **React Hook & Component** (`src/hooks/useMetadata.ts`)
- `usePageMetadata()` - Hook for managing page titles
- `MetadataHead` - Component wrapper using react-helmet-async
- Renders all OG, Twitter, and canonical tags

### 3. **react-helmet-async Integration**
- Wraps the entire app with `<HelmetProvider>` in `App.tsx`
- Automatically injects meta tags into `<head>` for every page
- Compatible with server-side rendering (SSR) when needed
- Safe for dynamic updates and React strict mode

### 4. **Page Implementations**
Each page now generates and renders appropriate metadata:

#### PropertyDetail Page
```typescript
const metadata = property ? generatePropertyMetadata(property) : null;
return (
  <div>
    {metadata && <MetadataHead metadata={metadata} />}
    {/* Page content */}
  </div>
);
```

**Generated Fields:**
- `og:title` → "3BHK Flat in Bangalore - UMY infra"
- `og:description` → "Flat • 3 BHK • Bangalore • ₹50L"
- `og:image` → First property image (or default)
- `og:url` → Canonical property URL
- `og:type` → "property"
- Plus Twitter Card equivalents

#### Properties Listing Page
```typescript
const metadata = generateListingPageMetadata(category, type);
return (
  <div>
    <MetadataHead metadata={metadata} />
  </div>
);
```

#### Homepage
```typescript
const metadata = generatePageMetadata('Home - UMY infra', 'description', '/');
return (
  <div>
    <MetadataHead metadata={metadata} />
  </div>
);
```

## Metadata Fields

### Open Graph Tags
| Tag | Source | Example |
|-----|--------|---------|
| `og:title` | Page title or property name | "3BHK Flat in Bangalore - UMY infra" |
| `og:description` | Summary with key info | "Flat • 3 BHK • Bangalore • ₹50L" |
| `og:image` | Primary property/page image | `https://example.com/property.jpg` |
| `og:url` | Canonical URL | `https://www.umyinfra.in/property/abc123` |
| `og:type` | Content type | "property", "website", "article" |
| `og:site_name` | Brand name | "UMY infra" |

### Twitter Card Tags
| Tag | Source |
|-----|--------|
| `twitter:card` | "summary_large_image" |
| `twitter:title` | Same as og:title |
| `twitter:description` | Same as og:description |
| `twitter:image` | Same as og:image |
| `twitter:creator` | "@umyinfra" |

### Standard SEO Tags
| Tag | Purpose |
|-----|---------|
| `title` | Browser tab title + SEO |
| `meta[description]` | Search engine snippet |
| `link[canonical]` | Prevent duplicate indexing |
| `meta[robots]` | Crawling instructions |
| `meta[author]` | Content creator |

## Fallback Defaults

All metadata includes intelligent fallbacks:

```typescript
const DEFAULT_DESCRIPTION = 'Premium real estate platform...';
const DEFAULT_IMAGE = 'https://www.umyinfra.in/og-image.png';
```

If a property doesn't have:
- Images → Uses default brand image
- Description → Uses sanitized property text (160 chars max)
- Location → Uses "Featured Property"
- Price → Omitted from description

## Implementation Checklist

- ✅ `react-helmet-async` installed and configured
- ✅ `HelmetProvider` wraps entire app in `App.tsx`
- ✅ Metadata utilities in `src/lib/metadata.ts`
- ✅ React Helmet hook in `src/hooks/useMetadata.ts`
- ✅ PropertyDetail page generates dynamic property metadata
- ✅ Properties listing page generates category metadata
- ✅ Homepage has appropriate metadata
- ✅ Default HTML has improved base metadata
- ✅ All social crawlers (WhatsApp, Facebook, LinkedIn) compatible
- ✅ Canonical URLs prevent duplicate indexing

## Usage Examples

### Adding Metadata to a New Page

```typescript
import { MetadataHead } from '@/hooks/useMetadata';
import { generatePageMetadata } from '@/lib/metadata';

export const MyPage = () => {
  const metadata = generatePageMetadata(
    'Page Title',
    'Short description for search results and social sharing',
    '/my-page'
  );

  return (
    <div>
      <MetadataHead metadata={metadata} />
      {/* Page content */}
    </div>
  );
};
```

### Custom Metadata for Complex Content

```typescript
const metadata = generateMetadata({
  title: 'Custom Title',
  description: 'Custom description',
  image: customImageUrl,
  url: customUrl,
  type: 'article',
  publishDate: '2024-01-15',
});
```

## Testing & Verification

### Facebook Sharing Debugger
1. Go to https://developers.facebook.com/tools/debug/
2. Paste your property URL
3. Verify og:image, og:title, og:description

### Twitter Card Validator
1. Go to https://cards-dev.twitter.com/validator
2. Paste your URL
3. Check twitter:image, twitter:title, twitter:description

### WhatsApp Preview
1. Share link in WhatsApp
2. Should show property image, title, and description

### LinkedIn Inspector
1. Go to https://www.linkedin.com/feed/
2. Paste URL in message
3. Verify preview metadata

## Performance Considerations

- Metadata is **static per page load** (no client-side re-rendering)
- `react-helmet-async` is **very lightweight** (~5KB gzipped)
- Head tags updated **before page renders**
- Compatible with **SSR** when needed in future
- **Zero impact** on page load performance

## Future Enhancements

1. **Structured Data (JSON-LD)** - Add schema.org markup for rich snippets
2. **Image Optimization** - Automatic resizing for OG image (1200x630px)
3. **Sitemap Generation** - Dynamic XML sitemap for SEO
4. **Meta Analytics** - Track which metadata drives clicks
5. **Next.js Migration** - Use `generateMetadata()` if upgrading framework

## Troubleshooting

### Tags Not Showing in Browser DevTools
- Check that HelmetProvider wraps the entire app
- Verify Helmet component is being rendered
- Hard refresh browser (Cmd+Shift+R on Mac)

### Social Preview Not Updating
- Share debugger might cache old metadata
- Add `?cache_bust=1` to URL temporarily
- Wait 24 hours for platform cache to clear

### Images Not Showing in Previews
- Ensure image URLs are **absolute** (start with https://)
- Image must be **publicly accessible**
- Recommended size: 1200x630px minimum
- Supported formats: JPG, PNG

## Configuration

All constants are in `src/lib/metadata.ts`:

```typescript
const SITE_NAME = 'UMY infra';
const SITE_URL = 'https://www.umyinfra.in';
const DEFAULT_DESCRIPTION = '...';
const DEFAULT_IMAGE = '...';
const TWITTER_HANDLE = '@umyinfra';
```

Update these values as needed for your brand.

---

**Last Updated:** February 2, 2026  
**Maintained By:** Development Team
