import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//import { CreateFileDto, } from './dto/create-files.dto';
import { PrismaService } from '../database/prisma.service';
import 'dotenv/config'

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  private bucketName = process.env.S3_BUCKET_NAME || ""
 
}
