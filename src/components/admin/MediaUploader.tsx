import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Loader2,
  GripVertical,
  Trash2,
  Plus,
  Link as LinkIcon,
} from 'lucide-react';
import { uploadToCloudinary, CloudinaryUploadResult } from '@/lib/cloudinary';
import { MediaItem } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface MediaUploaderProps {
  images: MediaItem[];
  videos: MediaItem[];
  onImagesChange: (images: MediaItem[]) => void;
  onVideosChange: (videos: MediaItem[]) => void;
  maxImages?: number;
  maxVideos?: number;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  type: 'image' | 'video';
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  images,
  videos,
  onImagesChange,
  onVideosChange,
  maxImages = 10,
  maxVideos = 5,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [addingYoutube, setAddingYoutube] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const extractYoutubeId = (url: string): string | null => {
    // Handle various YouTube URL formats (including Shorts)
    const regexes = [
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/, // YouTube Shorts - 11 char ID
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/, // youtu.be format
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/, // youtube.com watch format
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/, // youtube.com/embed format
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/, // youtube.com/v format
    ];

    for (const regex of regexes) {
      const match = url.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleAddYoutubeUrl = async () => {
    const youtubeId = extractYoutubeId(youtubeUrl);
    
    if (!youtubeId) {
      toast.error('Invalid YouTube URL. Please use a valid YouTube link.');
      return;
    }

    if (videos.length >= maxVideos) {
      toast.error(`Maximum ${maxVideos} videos allowed`);
      return;
    }

    try {
      setAddingYoutube(true);
      
      const mediaItem: MediaItem = {
        id: generateId(),
        url: `https://www.youtube.com/embed/${youtubeId}`,
        publicId: `youtube_${youtubeId}`,
        type: 'video',
        order: videos.length,
      };

      onVideosChange([...videos, mediaItem]);
      setYoutubeUrl('');
      toast.success('YouTube video added successfully');
    } catch (error) {
      console.error('Failed to add YouTube video:', error);
      toast.error('Failed to add YouTube video');
    } finally {
      setAddingYoutube(false);
    }
  };

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((f) => f.type.startsWith('image/'));
      const videoFiles = fileArray.filter((f) => f.type.startsWith('video/'));

      // Check limits
      if (images.length + imageFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }
      if (videos.length + videoFiles.length > maxVideos) {
        toast.error(`Maximum ${maxVideos} videos allowed`);
        return;
      }

      // Create upload entries
      const uploadEntries: UploadingFile[] = fileArray.map((file) => ({
        id: generateId(),
        file,
        progress: 0,
        type: file.type.startsWith('video/') ? 'video' : 'image',
      }));

      setUploadingFiles((prev) => [...prev, ...uploadEntries]);

      // Upload files
      for (const entry of uploadEntries) {
        try {
          const result = await uploadToCloudinary(entry.file, (progress) => {
            setUploadingFiles((prev) =>
              prev.map((f) => (f.id === entry.id ? { ...f, progress } : f))
            );
          });

          const mediaItem: MediaItem = {
            id: generateId(),
            url: result.secure_url,
            publicId: result.public_id,
            type: result.resource_type as 'image' | 'video',
            order: entry.type === 'image' ? images.length : videos.length,
          };

          if (entry.type === 'image') {
            onImagesChange([...images, mediaItem]);
          } else {
            onVideosChange([...videos, mediaItem]);
          }

          setUploadingFiles((prev) => prev.filter((f) => f.id !== entry.id));
        } catch (error) {
          console.error('Upload failed:', error);
          toast.error(`Failed to upload ${entry.file.name}`);
          setUploadingFiles((prev) => prev.filter((f) => f.id !== entry.id));
        }
      }
    },
    [images, videos, maxImages, maxVideos, onImagesChange, onVideosChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const removeVideo = (id: string) => {
    onVideosChange(videos.filter((vid) => vid.id !== id));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedItem] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedItem);
    onImagesChange(newImages.map((img, idx) => ({ ...img, order: idx })));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${
            dragActive
              ? 'border-amber-500 bg-amber-50'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
          }
        `}
      >
        <input
          type="file"
          id="media-upload"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
            <Upload className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">
              Drag & drop files here
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse from your device
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              Images: {images.length}/{maxImages}
            </span>
            <span className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              Videos: {videos.length}/{maxVideos}
            </span>
          </div>
        </div>
      </div>

      {/* YouTube URL Input */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-blue-50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            <Label className="text-base font-semibold text-slate-900">
              Add YouTube Video
            </Label>
          </div>
          <p className="text-sm text-slate-600">
            Paste a YouTube link (regular video or Shorts) to add to the property gallery
          </p>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=... or shorts/..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddYoutubeUrl()}
              className="flex-1"
              disabled={addingYoutube}
            />
            <Button
              onClick={handleAddYoutubeUrl}
              disabled={addingYoutube || !youtubeUrl.trim() || videos.length >= maxVideos}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {addingYoutube ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Uploading Progress */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {uploadingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  {file.type === 'video' ? (
                    <Video className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {file.file.name}
                  </p>
                  <Progress value={file.progress} className="h-1.5 mt-1" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{file.progress}%</span>
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-700">Images ({images.length})</h4>
            <p className="text-xs text-slate-400">Drag to reorder</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
              >
                <img
                  src={image.url}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => removeImage(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Order indicator */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 bg-white/90 rounded text-xs font-medium text-slate-700">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* First image badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-amber-500 text-white rounded text-xs font-medium">
                        Cover
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Preview */}
      {videos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700">Videos ({videos.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((video, index) => {
              const isYoutube = video.url.includes('youtube.com');
              
              return (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200"
                >
                  {isYoutube ? (
                    <iframe
                      src={video.url}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  
                  {/* Delete Button */}
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => removeVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* YouTube Badge */}
                  {isYoutube && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium">
                        YouTube
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
