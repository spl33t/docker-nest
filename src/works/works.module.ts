import { Module } from '@nestjs/common';
import { WorksController } from './works.controller';
import { WorksService } from './works.service';
import { FilesManagmentModule } from 'src/file-managment/files.module';

@Module({
  imports: [FilesManagmentModule],
  controllers: [WorksController],
  providers: [WorksService],
  exports: [WorksService]
})
export class WorksModule {}
