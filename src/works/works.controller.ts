import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto, UpdateWorkDto } from './works.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('works')
export class WorksController {
    constructor(private worksService: WorksService) {}

    @Post("/")
    create(@Body() data: CreateWorkDto) {
        return this.worksService.create(data)
    }


    @Public()
    @Get("/")
    all() {
        return this.worksService.all()
    }

    @Public()
    @Get("/:id")
    one(@Param("id") id: string) {
        return this.worksService.one({ id })
    }

    @Delete("/:id")
    delete(@Param("id") id: string) {
        return this.worksService.delete({ id })
    }

    @Put("/:id")
    put(
        @Body() data: UpdateWorkDto,
        @Param("id") id: string
    ) {
        return this.worksService.update({
            data,
            where: { id }
        })
    }
}
