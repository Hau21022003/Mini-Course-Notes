import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Course } from 'src/modules/course/entities/course.entity';

export class FindAllDto extends PaginationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsUUID()
  @IsExists(Course)
  @IsNotEmpty()
  courseId: string;
}
