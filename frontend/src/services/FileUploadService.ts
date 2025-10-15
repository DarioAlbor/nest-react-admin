import apiService from './ApiService';

interface UploadResponse {
  success: boolean;
  imageUrl: string;
  message: string;
}

class FileUploadService {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiService.post<UploadResponse>(
        '/api/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error uploading image');
    }
  }

  validateImage(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
      };
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File too large. Maximum size is 5MB.',
      };
    }

    return { isValid: true };
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';

    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If it's a relative path, prepend the API base URL
    return `${
      process.env.REACT_APP_API_URL || 'http://localhost:5000'
    }${imageUrl}`;
  }
}

export default new FileUploadService();
