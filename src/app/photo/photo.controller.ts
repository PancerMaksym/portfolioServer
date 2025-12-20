import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/photo')
export class PhotoConstroller {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.photoService.uploadImage(file);
      return {
        message: 'success',
        imgUrl: result.secure_url,
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
