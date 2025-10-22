import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FindAllDto } from 'src/modules/note/dto/find-all.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @GetUser('sub') userId: string) {
    return this.noteService.create(createNoteDto, userId);
  }

  @Post('find-all')
  findAll(@Body() findAllDto: FindAllDto, @GetUser('sub') userId: string) {
    return this.noteService.findAll(findAllDto, userId);
  }

  @Get(`:shareToken/share`)
  findOnePublic(@Param('shareToken') shareToken: string) {
    return this.noteService.findOnePublic(shareToken);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @GetUser('sub') userId: string,
  ) {
    return this.noteService.update(id, updateNoteDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this.noteService.remove(id, userId);
  }
}
