import { Controller, Get, Post, UseInterceptors, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthInterceptor } from './auth.interceptor';
import { LoginInput, RegisterInput } from './types';
import { CurrentUser } from './session.decorator';
import { User } from '@prisma/client';
import { Public } from './public.decorator';

@Controller("auth")
export class AuthController {
  constructor(
    private usersService: UsersService
  ) {}

  @Public()
  @UseInterceptors(AuthInterceptor)
  @Post("/login")
  async login(@Body() dto: LoginInput) {
    const user = await this.usersService.user({ login: dto.login })

    this.usersService.comparePassword(user, dto.password)

    return user
  }

  @Public()
  @UseInterceptors(AuthInterceptor)
  @Post("/register")
  async register(@Body() dto: RegisterInput) {
    return await this.usersService.createUser(dto)
  }

  @Get("/me")
  async session(@CurrentUser() user: User) {
    return user
  }
}









