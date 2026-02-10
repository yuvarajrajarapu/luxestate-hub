import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const title = searchParams.get('title') || 'UMY Infra - Premium Real Estate';
    const address = searchParams.get('address') || '';
    const price = searchParams.get('price') || '';
    const propertyType = searchParams.get('type') || '';
    const imageUrl = searchParams.get('image') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: imageUrl 
              ? `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url(${imageUrl})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '80px',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                UMY Infra
              </div>
            </div>

            {/* Property Type Badge */}
            {propertyType && (
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(99, 102, 241, 0.9)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '24px',
                  textTransform: 'uppercase',
                }}
              >
                {propertyType}
              </div>
            )}

            {/* Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '24px',
                maxWidth: '90%',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {title.length > 60 ? title.substring(0, 60) + '...' : title}
            </div>

            {/* Address */}
            {address && (
              <div
                style={{
                  fontSize: '32px',
                  color: '#e2e8f0',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                📍 {address}
              </div>
            )}

            {/* Price */}
            {price && (
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#10b981',
                  marginTop: '16px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {price}
              </div>
            )}

            {/* Bottom Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '80px',
                right: '80px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '2px solid rgba(255,255,255,0.2)',
                paddingTop: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  color: '#cbd5e1',
                }}
              >
                Premium Real Estate Portal
              </div>
              <div
                style={{
                  fontSize: '24px',
                  color: '#cbd5e1',
                }}
              >
                umyinfra.in
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
