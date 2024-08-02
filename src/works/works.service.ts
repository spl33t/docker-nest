import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateWorkDto, UpdateWorkDto } from './works.dto';
import { FilesService } from 'src/file-managment/files.service';

const select = {
    id: true,
    name: true,
    photos: true
}

@Injectable()
export class WorksService {
    constructor(private prisma: PrismaService,
        private filesService: FilesService
    ) {}

    async one(where: Prisma.WorkWhereUniqueInput) {
        return await this.prisma.work.findUnique({
            where,
            select
        });

    }

    async all(where?: Prisma.WorkWhereInput) {
        return await this.prisma.work.findMany({
            where,
            select,
            orderBy: { createdAt: "desc" }
        });
    }

    async create(data: CreateWorkDto) {
        return await this.prisma.work.create({
            data: {
                name: data.name,
            },
            select
        });

    }

    async update(params: {
        where: Prisma.WorkWhereUniqueInput;
        data: UpdateWorkDto
    }) {
        return this.prisma.work.update({
            ...params
        });
    }

    async delete(where: { id: string }) {
        await this.filesService.deleteManyFilesByRelationId({ id: where.id })
        return this.prisma.work.delete({
            where,
        });
    }
}