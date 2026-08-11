import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { GraphyAuthGuard } from '../common/auth/graphy-auth.guard';
import { RolesGuard } from '../common/auth/roles.guard';
import { Roles } from '../common/auth/roles.decorator';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
];
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

@Controller('upload')
@UseGuards(GraphyAuthGuard, RolesGuard)
@Roles('super_admin')
export class UploadController {
  constructor(config: ConfigService) {
    const cloudinaryUrl = config.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      const credentials = new URL(cloudinaryUrl);
      if (credentials.protocol !== 'cloudinary:') {
        throw new Error('CLOUDINARY_URL must use the cloudinary:// scheme.');
      }
      cloudinary.config({
        cloud_name: credentials.hostname,
        api_key: decodeURIComponent(credentials.username),
        api_secret: decodeURIComponent(credentials.password),
        secure: true,
      });
    } else {
      cloudinary.config({ secure: true });
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only image and video files are allowed'),
            false,
          );
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
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(
              new BadRequestException(`Upload failed: ${error.message}`),
            );
          }
          resolve({ url: result?.secure_url });
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
