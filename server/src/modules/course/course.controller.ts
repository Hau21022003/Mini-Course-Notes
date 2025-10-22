import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@UseGuards(AdminGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser('sub') userId: string,
  ) {
    return this.courseService.create(createCourseDto, userId);
  }

  @Post('find-all')
  findAll(@Body() dto: PaginationDto, @GetUser('sub') userId: string) {
    return this.courseService.findAll(dto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @GetUser('sub') userId: string,
  ) {
    return this.courseService.update(id, updateCourseDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this.courseService.remove(id, userId);
  }
}
