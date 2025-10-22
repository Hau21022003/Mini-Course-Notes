import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/modules/note/entities/note.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { CourseModule } from 'src/modules/course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UsersModule, CourseModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
