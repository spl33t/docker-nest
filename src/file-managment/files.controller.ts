import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { GetAllFilesDto } from './dto/get-all-files.dto';
import { DeleteOneFileByIdDto } from './dto/delete-one-file-by-id.dto';
//import { CreateFileDto } from './dto/create-files.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

/*   @Post()
  @FormDataRequest()
  async upload(@Body() dto: CreateFileDto) {
    return await this.filesService.createFile(dto);
  }

  @Get()
  async getAll(@Query() dto: GetAllFilesDto) {
    return await this.filesService.getAll(dto);
  }


  @Delete()
  async deleteOneById(@Query() dto: DeleteOneFileByIdDto) {
    return await this.filesService.deleteFile(dto);
  } */
}
