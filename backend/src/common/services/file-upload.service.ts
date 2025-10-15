import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import * as sharp from 'sharp';
import * as uuid from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly uploadPath = './uploads/images';
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = extname(file.originalname);
    const fileName = `${uuid.v4()}${fileExtension}`;
    const filePath = `${this.uploadPath}/${fileName}`;

    try {
      // Compress and save image
      await sharp(file.buffer)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 80 })
        .toFile(filePath);

      // Return relative URL for frontend
      return `/uploads/images/${fileName}`;
    } catch (error) {
      throw new Error(`Error processing image: ${error.message}`);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new Error(`File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    try {
      const fs = require('fs');
      const path = require('path');
      
      // Extract filename from URL
      const fileName = path.basename(imageUrl);
      const filePath = path.join(this.uploadPath, fileName);

      // Check if file exists and delete
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting image: ${error.message}`);
    }
  }
}
