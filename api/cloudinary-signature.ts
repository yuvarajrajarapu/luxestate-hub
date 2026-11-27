export const config = {
  runtime: 'edge',
};

const DEFAULT_FIREBASE_PROJECT_ID = 'yuvainfraedge';
const CLOUDINARY_FOLDER = 'umy-infra';

function jsonResponse(body: object, status: number): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function getTokenPayload(token: string): { sub?: string; aud?: string; iss?: string; exp?: number } | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')));
  } catch {
    return null;
  }
}

async function createCloudinarySignature(parameters: Record<string, string>, apiSecret: string): Promise<string> {
  const stringToSign = Object.entries(parameters)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const digest = await crypto.subtle.digest(
    'SHA-1',
    new TextEncoder().encode(`${stringToSign}${apiSecret}`)
  );

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authorization = request.headers.get('authorization');
  const idToken = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!idToken) {
    return jsonResponse({ error: 'Authentication required' }, 401);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;
  const tokenPayload = getTokenPayload(idToken);
  if (
    !tokenPayload?.sub ||
    tokenPayload.aud !== projectId ||
    tokenPayload.iss !== `https://securetoken.google.com/${projectId}` ||
    !tokenPayload.exp ||
    tokenPayload.exp * 1000 <= Date.now()
  ) {
    return jsonResponse({ error: 'Invalid authentication token' }, 401);
  }

  const userResponse = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${encodeURIComponent(tokenPayload.sub)}`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  if (userResponse.status === 401) {
    return jsonResponse({ error: 'Invalid authentication token' }, 401);
  }
  if (userResponse.status === 403 || userResponse.status === 404) {
    return jsonResponse({ error: 'Administrator access required' }, 403);
  }
  if (!userResponse.ok) {
    return jsonResponse({ error: 'Unable to verify administrator access' }, 502);
  }

  const userDocument = await userResponse.json() as {
    fields?: { role?: { stringValue?: string } };
  };
  if (userDocument.fields?.role?.stringValue !== 'admin') {
    return jsonResponse({ error: 'Administrator access required' }, 403);
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dswoyink7';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    return jsonResponse({ error: 'Media upload service is not configured' }, 503);
  }

  let resourceType: 'image' | 'video';
  try {
    const body = await request.json() as { resourceType?: unknown };
    if (body.resourceType !== 'image' && body.resourceType !== 'video') {
      return jsonResponse({ error: 'Unsupported media type' }, 400);
    }
    resourceType = body.resourceType;
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const parameters = { folder: CLOUDINARY_FOLDER, timestamp };
  const signature = await createCloudinarySignature(parameters, apiSecret);

  return jsonResponse(
    {
      apiKey,
      cloudName,
      resourceType,
      ...parameters,
      signature,
    },
    200
  );
}
