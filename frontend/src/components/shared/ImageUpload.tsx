import { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'react-feather';

import fileUploadService from '../../services/FileUploadService';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  disabled = false,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = fileUploadService.validateImage(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    setIsUploading(true);

    try {
      const imageUrl = await fileUploadService.uploadImage(file);
      onChange(imageUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setError(undefined);
  };

  const imageUrl = fileUploadService.getImageUrl(value || '');

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block font-medium text-gray-700">Imagen</label>

      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Content preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={disabled}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex flex-col items-center ${
              disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-urbano-primary mb-2"></div>
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <Upload className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600 mb-1">
                  Haz clic para subir una imagen
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, WebP (máx. 5MB)
                </p>
              </>
            )}
          </label>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ImageIcon size={16} />
          <span>Imagen cargada correctamente</span>
        </div>
      )}
    </div>
  );
}
