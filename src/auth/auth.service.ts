import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  HttpException
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async loginUser(loginAuthDto: LoginDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository.findOne({
      relations: [
        'profileUser',
        'profileUser.profile',
        'profileUser.profile.accessProfile',
        'profileUser.profile.accessProfile.access',
      ],
      where: {
        email: email,
      },
    });

    if (!user) throw new HttpException('User Not Found', 404);

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) throw new HttpException('Incorrect Password', 403);

    let accessArray = []
    for (const userProfile of user.profileUser) {
      for (const profileAccess of userProfile.profile.accessProfile) {
        accessArray.push(profileAccess.access.name)
      }
    }

    const payload = {
      id: user.id,
      username: user.username,
      access: accessArray,
    };
    const token = await this.jwtService.sign(payload);

    const data = {
      user: user,
      token,
    };

    return data;
  }

  async profile({ email }: { email: string; }) {
    return await this.usersService.findOneByEmail(email);
  }

  async checkToken(token: string) {
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

  async sendEmailCode(emailDto: EmailDto) {
    //se genera un código aleatorio de 4 dígitos
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();
    let response: Object;
    try {
      await this.emailService.sendEmail(
        emailDto.email,
        'Validación de registro',
        `Aqui esta tu código verificador ${codigo}, no lo compartas con nadie`,
      );

      // this.codigo = codigo
      return (response = {
        code: codigo,
      });
    } catch (error) {
      throw new Error('Error al enviar mail' + error);
    }
  }

  validateCode(codigoGenerado: string, codigoIngresado): Boolean {
    return codigoGenerado == codigoIngresado;
  }

  validateAccess(token: string) {
    const tokenFinal = token.slice(7);
    const decodedToken: any = this.jwtService.decode(tokenFinal);
    const access = decodedToken.access;
    return access;
  }
}
