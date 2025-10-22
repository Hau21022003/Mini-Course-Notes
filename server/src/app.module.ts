import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsExistConstraint } from 'src/common/validators/is-exist-constraint.validator';
import { dbOptions, load } from 'src/config/db.config';
import { UsersModule } from 'src/modules/users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CourseModule } from 'src/modules/course/course.module';
import { NoteModule } from 'src/modules/note/note.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300 * 1000,
      max: 100,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [load],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbOptions,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CloudinaryModule,
    FileUploadModule,
    CourseModule,
    NoteModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    IsExistConstraint,
  ],
})
export class AppModule {}
