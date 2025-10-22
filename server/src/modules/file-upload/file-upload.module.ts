// src/app.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from 'src/modules/file-upload/file-upload.controller';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: FileUploadService,
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
