import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoProvider } from './photo.provider';
import { PhotoConstroller } from './photo.controller';

@Module({
  providers: [PhotoService, PhotoProvider],
  controllers: [PhotoConstroller]
})

export class PhotoModule {}
