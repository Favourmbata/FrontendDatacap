import React from 'react';

interface MediaUploadProps {
  images: File[];
  videos: File[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeVideo: (index: number) => void;
  errors: Record<string, string>;
  mediaLimits: {
    images: { current: number; max: number; remaining: number };
    videos: { current: number; max: number; remaining: number };
    verified: boolean;
  } | null;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  images, 
  videos, 
  handleImageUpload, 
  handleVideoUpload, 
  removeImage, 
  removeVideo, 
  errors, 
  mediaLimits 
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Media Upload</h3>
      
      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images (Max 5MB each, JPEG/PNG/WebP)
        </label>
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 10 12 15 7 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span className="text-gray-600">Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images}</p>
        )}
        
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Videos (Max 50MB each, MP4/MPEG/MOV/AVI)
        </label>
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400 mr-2"><polygon points="23.5 12 23.5 23.5 0.5 23.5 0.5 0.5 23.5 0.5 23.5 12"></polygon><polyline points="16.5 6.5 16.5 17.5 7.5 17.5 7.5 6.5 16.5 6.5"></polyline></svg>
            <span className="text-gray-600">Upload Videos</span>
            <input
              type="file"
              multiple
              accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>
        </div>
        {errors.videos && (
          <p className="mt-1 text-sm text-red-600">{errors.videos}</p>
        )}
        
        {videos.length > 0 && (
          <div className="mt-3 space-y-2">
            {videos.map((video, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500 mr-2"><polygon points="23.5 12 23.5 23.5 0.5 23.5 0.5 0.5 23.5 0.5 23.5 12"></polygon><polyline points="16.5 6.5 16.5 17.5 7.5 17.5 7.5 6.5 16.5 6.5"></polyline></svg>
                  <span className="text-sm text-gray-700">{video.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({(video.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Media Limits Info */}
      {mediaLimits && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Media Limits</p>
            <p>Images: {mediaLimits.images.current}/{mediaLimits.images.max} used ({mediaLimits.images.remaining} remaining)</p>
            <p>Videos: {mediaLimits.videos.current}/{mediaLimits.videos.max} used ({mediaLimits.videos.remaining} remaining)</p>
            {!mediaLimits.verified && (
              <p className="text-xs mt-1">Upgrade to verified badge for more upload slots.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
