import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from 'src/modules/course/entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  create(createCourseDto: CreateCourseDto, userId: string) {
    return this.courseRepository.save({
      ...createCourseDto,
      createdBy: { id: userId },
    });
  }

  async findAll(dto: PaginationDto, userId: string) {
    const [data, total] = await this.courseRepository.findAndCount({
      where: { createdBy: { id: userId } },
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
    return this.courseRepository.findOneOrFail({
      where: { id },
      relations: ['createdBy'],
    });
  }

  update(id: string, updateCourseDto: UpdateCourseDto, userId: string) {
    return this.courseRepository.update(
      { id: id, createdBy: { id: userId } },
      updateCourseDto,
    );
  }

  remove(id: string, userId: string) {
    return this.courseRepository.delete({ id, createdBy: { id: userId } });
  }
}
