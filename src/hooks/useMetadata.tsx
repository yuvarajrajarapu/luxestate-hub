import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import type { MetadataConfig } from '@/lib/metadata';
import { generateOGMetadata, generateTwitterMetadata } from '@/lib/metadata';

/**
 * Custom hook to set page metadata (title, description, OG tags, etc.)
 * Works with react-helmet-async for proper head management
 */
export const usePageMetadata = (metadata: MetadataConfig) => {
  useEffect(() => {
    // Update document title for better SEO
    document.title = metadata.title;
  }, [metadata.title]);

  const ogMetadata = generateOGMetadata(metadata);
  const twitterMetadata = generateTwitterMetadata(metadata);

  return { ogMetadata, twitterMetadata };
};

/**
 * Component wrapper for setting metadata using Helmet
 * Usage: <MetadataHead metadata={config} />
 */
export const MetadataHead = ({ metadata }: { metadata: MetadataConfig }) => {
  const ogMetadata = generateOGMetadata(metadata);
  const twitterMetadata = generateTwitterMetadata(metadata);

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="author" content={metadata.author} />
      <link rel="canonical" href={metadata.url} />

      {/* Open Graph Tags */}
      {Object.entries(ogMetadata).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}

      {/* Twitter Card Tags */}
      {Object.entries(twitterMetadata).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* Additional SEO Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
    </Helmet>
  );
};

export default MetadataHead;
