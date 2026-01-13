const CLOUD_NAME = 'dswoyink7';
const UPLOAD_PRESET = 'yuvainfraedge';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video';
  format: string;
  width?: number;
  height?: number;
  duration?: number;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
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
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
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
