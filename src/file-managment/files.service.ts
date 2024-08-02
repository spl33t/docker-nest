import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3, Endpoint } from 'aws-sdk';
import * as uuid from 'uuid';
import { File as FilePrisma, Prisma } from '@prisma/client';
import { GetOneFileByIdDto } from './dto/get-one-file-by-id.dto';
import { GetAllFilesDto } from './dto/get-all-files.dto';
import { DeleteOneFileByIdDto } from './dto/delete-one-file-by-id.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { CreateFileDto, } from './dto/create-files.dto';
import { PrismaService } from '../database/prisma.service';
import 'dotenv/config'

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  private bucketName = process.env.S3_BUCKET_NAME || ""
 
}
