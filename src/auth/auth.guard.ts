import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestWithAuth, JwtPayload } from "./types"
import { AuthController } from './auth.controller';
import { AUTH_MODULE_CONSTANTS } from './constants';
import { JwtService } from "./jwt.service"
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const req = context.switchToHttp().getRequest() as RequestWithAuth
    const at = req.cookies[AUTH_MODULE_CONSTANTS.ACCESS_TOKEN_KEY]

    if (!at) throw new ForbiddenException()
    const payload = await this.jwtService.verifyAccessToken(at)

    const user = await this.usersService.user({ id: payload.id })
    if (!user) throw new UnauthorizedException()

    if (Boolean(payload)) {
      req.user = user
      return true
    }

    throw new UnauthorizedException()
  }
}