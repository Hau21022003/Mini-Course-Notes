import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from 'src/modules/note/entities/note.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseService } from 'src/modules/course/course.service';
import * as crypto from 'crypto';
import { FindAllDto } from 'src/modules/note/dto/find-all.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private courseService: CourseService,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    await this.checkIfCourseOwner(createNoteDto.courseId, userId);
    let shareToken: string | null = null;

    if (createNoteDto.isPublic) {
      shareToken = this.generateShareToken();
    }

    return this.noteRepository.save({
      ...createNoteDto,
      shareToken,
      createdBy: { id: userId },
    });
  }

  async checkIfCourseOwner(courseId: string, userId: string) {
    const course = await this.courseService.findOne(courseId);
    if (course.createdBy.id !== userId) {
      throw new BadRequestException(
        'Bạn không có quyền chỉnh sửa khóa học này.',
      );
    }
  }

  async findAll(dto: FindAllDto, userId: string) {
    const where: Record<string, any> = {
      createdBy: { id: userId },
      courseId: dto.courseId,
    };
    if (dto.title?.trim()) {
      where.title = ILike(`%${dto.title.trim()}%`);
    }
    const [data, total] = await this.noteRepository.findAndCount({
      where,
      order: { updatedAt: 'DESC' },
      skip: dto.offset,
      take: dto.pageSize,
    });

    return {
      data,
      total,
    };
  }

  findOne(id: string) {
    return this.noteRepository.findOneOrFail({
      where: { id },
    });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string) {
    const note = await this.noteRepository.findOne({
      where: { id, createdBy: { id: userId } },
    });

    if (!note) {
      throw new NotFoundException(
        'Không tìm thấy ghi chú hoặc bạn không có quyền chỉnh sửa.',
      );
    }

    if (updateNoteDto.isPublic !== undefined) {
      if (updateNoteDto.isPublic) {
        note.shareToken = this.generateShareToken();
      } else {
        note.shareToken = null;
      }
    }

    Object.assign(note, updateNoteDto);
    return this.noteRepository.save(note);
  }

  async findOnePublic(shareToken: string) {
    const note = await this.noteRepository.findOne({
      where: { shareToken, isPublic: true },
      relations: ['course'],
    });

    if (!note) {
      throw new NotFoundException(
        'Ghi chú không tồn tại hoặc không còn được chia sẻ.',
      );
    }

    return note;
  }

  remove(id: string, userId: string) {
    return this.noteRepository.delete({ id, createdBy: { id: userId } });
  }

  private generateShareToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
