import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { Course } from 'src/modules/course/entities/course.entity';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  contentUrl?: string;

  @IsUUID()
  @IsExists(Course)
  @IsNotEmpty()
  courseId: string;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean = false;
}
