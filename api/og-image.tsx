import { ImageResponse } from '@vercel/og';
import { buildPropertyMetadata, fetchPropertyByCode, escapeHtml } from './_shared/property-metadata.js';

export const config = {
  maxDuration: 60,
};

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyCode = searchParams.get('code') || searchParams.get('propertyCode') || '';

    if (!propertyCode) {
      return new Response('Missing property code', { status: 400 });
    }

    const property = await fetchPropertyByCode(propertyCode);

    if (!property) {
      return new Response('Property not found', { status: 404 });
    }

    const metadata = buildPropertyMetadata(property);
    const propertyType = property.propertyType || property.category || 'Property';
    const location = property.location || property.city || property.address || 'India';
    const price = metadata.title.match(/\|\s([^|]+)\s\|\sUMY Infra$/)?.[1] || '';
    const imageUrl = metadata.primaryImageUrl || '';
    const headline = metadata.title.replace(/\s\|\s[^|]+\s\|\sUMY Infra$/, '');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'relative',
            background: 'linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)',
            color: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '56px',
                width: '56%',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '999px',
                      background: '#38bdf8',
                      boxShadow: '0 0 24px rgba(56, 189, 248, 0.7)',
                    }}
                  />
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>UMY Infra</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      padding: '10px 18px',
                      borderRadius: '999px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#e0f2fe',
                    }}
                  >
                    {propertyType}
                  </div>
                  <div
                    style={{
                      padding: '10px 18px',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#d1fae5',
                    }}
                  >
                    {location}
                  </div>
                </div>

                <div style={{ fontSize: '56px', lineHeight: 1.05, fontWeight: 900, letterSpacing: '-0.04em', maxWidth: '96%' }}>
                  {headline.length > 72 ? `${headline.slice(0, 72)}...` : headline}
                </div>

                <div style={{ fontSize: '30px', lineHeight: 1.35, color: '#cbd5e1', maxWidth: '92%' }}>
                  {property.description || metadata.description}
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {price && (
                    <div style={{ fontSize: '48px', fontWeight: 900, color: '#34d399', letterSpacing: '-0.03em' }}>
                      {price}
                    </div>
                  )}
                  <div style={{ fontSize: '24px', color: '#94a3b8' }}>Verified listing • umyinfra.in</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'stretch',
                  width: '44%',
                  height: '100%',
                  position: 'relative',
                  background: '#0b1120',
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={escapeHtml(metadata.ogImageAlt)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)' }} />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.72) 100%)',
                  }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 56px',
                  background: 'rgba(2, 6, 23, 0.72)',
                  borderTop: '1px solid rgba(148, 163, 184, 0.22)',
                  fontSize: '20px',
                  color: '#cbd5e1',
                }}
              >
                <div>UMY Infra • Premium Real Estate</div>
                <div>www.umyinfra.in</div>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (error: any) {
    console.error('Error generating OG image:', error);
    return new Response(`Failed to generate image: ${error.message}`, { status: 500 });
  }
}
