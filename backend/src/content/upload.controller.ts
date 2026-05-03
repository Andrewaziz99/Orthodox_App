import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import * as dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary (requires CLOUDINARY_URL in .env)
// e.g. CLOUDINARY_URL=cloudinary://my_key:my_secret@my_cloud_name

// If the environment variable isn't automatically picked up, we can force it by parsing or manually passing it
const cloudUrl = process.env.CLOUDINARY_URL || '';
const urlParts = cloudUrl.replace('cloudinary://', '').split('@');
if (urlParts.length === 2) {
  const [keys, cloud_name] = urlParts;
  const [api_key, api_secret] = keys.split(':');
  
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
} else {
  cloudinary.config({
    secure: true,
  });
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/quicktime', 'video/x-msvideo'
];
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image and video files are allowed'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'orthodox-app',
          resource_type: 'auto' // Automatically detect if it's an image or video
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new BadRequestException(`Upload failed: ${error.message}`));
          }
          resolve({ url: result?.secure_url });
        },
      );

      // Write the file buffer to the stream
      uploadStream.end(file.buffer);
    });
  }
}

