import { auth } from '@/lib/firebase';

export const MAX_UPLOAD_BYTES = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
} as const;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video';
  format: string;
  width?: number;
  height?: number;
  duration?: number;
}

interface CloudinaryUploadSignature {
  apiKey: string;
  cloudName: string;
  resourceType: 'image' | 'video';
  folder: string;
  timestamp: string;
  signature: string;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw new Error('Only image and video files can be uploaded');
  }

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  if (file.size > MAX_UPLOAD_BYTES[resourceType]) {
    throw new Error(`File exceeds the ${resourceType} upload size limit`);
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be signed in as an administrator to upload media');
  }

  const idToken = await currentUser.getIdToken();
  const signatureResponse = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resourceType }),
  });
  const signatureBody = await signatureResponse.json();
  if (!signatureResponse.ok) {
    throw new Error(signatureBody.error || 'Unable to authorize media upload');
  }
  const uploadSignature = signatureBody as CloudinaryUploadSignature;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', uploadSignature.apiKey);
    formData.append('timestamp', uploadSignature.timestamp);
    formData.append('signature', uploadSignature.signature);
    formData.append('folder', uploadSignature.folder);

    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            secure_url: response.secure_url,
            public_id: response.public_id,
            resource_type: response.resource_type,
            format: response.format,
            width: response.width,
            height: response.height,
            duration: response.duration,
          });
        } catch {
          reject(new Error('Cloudinary returned an invalid upload response'));
        }
      } else {
        reject(new Error('Cloudinary upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Cloudinary upload request failed'));
    });

    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${uploadSignature.cloudName}/${uploadSignature.resourceType}/upload`
    );
    xhr.send(formData);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // Note: Deletion requires server-side implementation with API secret
  // This is a placeholder for frontend reference
  console.log('Delete request for:', publicId);
};

export const getOptimizedUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string => {
  if (!url.includes('cloudinary.com')) return url;
  
  const { width, height, quality = 'auto', format = 'auto' } = options;
  const transformations: string[] = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push('c_fill');
  
  const transformation = transformations.join(',');
  return url.replace('/upload/', `/upload/${transformation}/`);
};
