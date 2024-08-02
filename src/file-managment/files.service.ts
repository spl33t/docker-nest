import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import { File as FilePrisma, Prisma } from '@prisma/client';
import { GetOneFileByIdDto } from './dto/get-one-file-by-id.dto';
import { GetAllFilesDto } from './dto/get-all-files.dto';
import { DeleteOneFileByIdDto } from './dto/delete-one-file-by-id.dto';
import { fileTypesConfig, getFileType } from './file-types';
import { BadRequestException } from '@nestjs/common';
import { CreateFileDto, } from './dto/create-files.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  private bucketName = process.env.S3_BUCKET_NAME || ""
  private s3ProviderEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT || "");

  private s3Stream = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: this.s3ProviderEndpoint,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });

  async getAll(dto: GetAllFilesDto) {
    const files = await this.prismaService.file.findMany();

    const res = await Promise.all(
      files.map(async (file) => {
        return {
          ...file,
          location: await this.buildLocation(file),
        };
      }),
    );
    return res;
  }

  async getOneById(dto: GetOneFileByIdDto) {
    const file = await this.prismaService.file.findFirst({ where: dto });
    if (file)
      return {
        ...file,
        location: await this.buildLocation(file),
      };

    return null;
  }

  async createFile({ relationId, files, type }: CreateFileDto) {
    const result = [] as any[]
    for (const file of files) {
      const fileId = uuid.v4();
      const originalName = decodeURI(Buffer.from(file.name, 'utf-8').toString('utf8'));
      const fileExtension = file.name.split(".").pop()
      const fileType = getFileType(type)

      if (!originalName || !fileExtension) {
        throw new BadRequestException('originalName or fileExtension invalid');
      }

      if (fileType.isMultiple === false) {
        const existFiles = await this.prismaService.file.findMany({
          where: {
            relationId,
            type,
          },
        });

        await this.deleteManyFileById({ ids: existFiles.map((s) => s.id) });
      }

      let uploadedFile: AWS.S3.ManagedUpload.SendData;

      try {
        uploadedFile = await this.s3Stream
          .upload({
            Bucket: this.bucketName,
            Key: await this.buildKey({ relationId, fileId, fileExtension }),
            Body: Buffer.from(await file.arrayBuffer()),
          })
          .promise();

        //console.log(uploadedFile)
      } catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const createdFile = await this.prismaService.file.create({
        data: {
          id: fileId,
          location: uploadedFile.Location,
          type,
          originalName,
          extension: fileExtension,
          relationId,
        },
      });

      result.push(createdFile)
    }

    return result
  }


  async downloadFile({ id }: GetOneFileByIdDto) {
    const s3File = await this.s3Stream
      .getObject({
        Bucket: this.bucketName,
        Key: await this.buildKey({ fileId: id }),
      })
      .promise();

    return s3File;
  }

  async deleteFile({ id }: DeleteOneFileByIdDto) {
    await this.s3Stream
      .deleteObject({
        Bucket: this.bucketName,
        Key: await this.buildKey({ fileId: id }),
      })
      .promise();

    return await this.prismaService.file.delete({ where: { id } });
  }

  async deleteManyFileById({ ids }: { ids: string[] }) {
    const filesToDelete = (
      await Promise.all(
        ids.map(async (id) => {
          return { Key: await this.buildKey({ fileId: id }) };
        }),
      )
    ).filter((s) => s.Key);

    if (filesToDelete.length !== 0) {
      await this.s3Stream
        .deleteObjects({
          Bucket: this.bucketName,
          Delete: {
            Objects: filesToDelete,
          },
        })
        .promise();

      return await this.prismaService.$transaction(
        ids.map((id) =>
          this.prismaService.file.delete({
            where: { id },
          }),
        ),
      );
    } else return null;
  }

  async deleteManyFilesByRelationId({ id }: { id: string }) {
    const existFiles = await this.prismaService.file.findMany({
      where: {
        relationId: id,
      },
    });

    return await this.deleteManyFileById({ ids: existFiles.map((s) => s.id) });
  }

  private async buildKey({
    relationId,
    fileExtension,
    fileId,
  }: {
    relationId?: string;
    fileId: string;
    fileExtension?: string;
  }) {
    if (!fileExtension || !relationId) {
      const file = await this.prismaService.file.findFirst({
        where: {
          id: fileId,
        },
      });
      fileExtension = file?.extension;
      relationId = file?.relationId;
    }

    if (!fileExtension || !relationId) {
      throw Error("file service Build key failed")
    }

    let s3FileKey = `${relationId}/${fileId}.${fileExtension}`;
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'dev'
    ) {
      s3FileKey = '__dev__/' + s3FileKey;
    }
    return s3FileKey;
  }

  private async buildLocation(file: any) {
    const key = await this.buildKey({
      fileId: file.id,
      relationId: file.relationId,
      fileExtension: file.extension,
    });
    return `${this.s3ProviderEndpoint.href}${this.bucketName}/${key}`;
  }
}
