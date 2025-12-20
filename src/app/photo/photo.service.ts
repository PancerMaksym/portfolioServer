import { Injectable } from '@nestjs/common';
const toStream = require('buffer-to-stream');
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class PhotoService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          invalidate: true,
          resource_type: 'auto',
          filename_override: file.originalname,
          folder: 'product-images',
          use_filename: true,
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
