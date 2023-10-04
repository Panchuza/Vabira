import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  async profile({ email }: { email: string; }) {
    return await this.usersService.findOneByEmail(email);
  }

  async checkToken(token: string){
    if (!token) {
      return { message: 'Token no proporcionado' };
    }
    try {
      const decoded = this.jwtService.verify(token);
      return { message: 'Token válido' };
    } catch (error) {
      return { message: 'Token inválido' };
    }
  }
}
