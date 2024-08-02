import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';
import { GetOneFileByIdDto } from './dto/get-one-file-by-id.dto';
import { GetAllFilesDto } from './dto/get-all-files.dto';
import { DeleteOneFileByIdDto } from './dto/delete-one-file-by-id.dto';
import { CreateFileDto } from './dto/create-files.dto';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}
/* 
  @TypedRoute.Post()
  async upload(@TypedFormData.Body() dto: CreateFileDto) {
    return await this.filesService.createFile(dto);
  }

  @TypedRoute.Get()
  async getAll(@TypedQuery() dto: GetAllFilesDto) {
    return await this.filesService.getAll(dto);
  }

  async getOneById(@TypedQuery() dto: GetOneFileByIdDto) {
    return await this.filesService.getOneById(dto);
  }

  @TypedRoute.Delete()
  async deleteOneById(@TypedQuery() dto: DeleteOneFileByIdDto) {
    return await this.filesService.deleteFile(dto);
  }

  async deleteManyFilesByIds(@TypedQuery() dto: { ids: string[] }) {
    return await this.filesService.deleteManyFileById(dto);
  }

  async deleteManyFilesByRelationId(@TypedQuery() dto: { id: string }) {
    return await this.filesService.deleteManyFilesByRelationId(dto);
  } */
}
