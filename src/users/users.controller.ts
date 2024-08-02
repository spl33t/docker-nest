import { Body, Controller, Delete, Get, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';

@Controller('users')
export class UsersController  {
    constructor(private usersService: UsersService) {}

    @Post("/")
    createUser(
        @Body() data: Prisma.UserCreateInput
    ) {
        return this.usersService.createUser(data)
    }

    @Get("/")
    users() {
        return this.usersService.users({})
    }

    @Get("/:id")
    user(
        @Param("idOrLogin") id: string
    ) {
        return this.usersService.user({ id })
    }

    @Delete("/:id")
    deleteUser(
        @Param("idOrLogin") id: string
    ) {
        return this.usersService.deleteUser({ id })
    }

    @Put("/:id")
    updateUser(
        @Body() data: Omit<Prisma.UserUpdateInput, "password">,
        @Param("id") id: string
    ) {
        return this.usersService.updateUser({
            data,
            where: { id }
        })
    }
}
