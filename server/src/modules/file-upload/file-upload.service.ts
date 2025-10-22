// src/file-upload/file-upload.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';

@Injectable()
export class FileUploadService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        return {
          folder: 'nestjs_uploads',
          resource_type: 'image',
        } as any;
      },
    });

    return {
      storage,
    };
  }
}
