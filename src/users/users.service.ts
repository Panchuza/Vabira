import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { DbException } from 'src/exception/dbException';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtPayload } from 'src/auth/interfaces';


@Injectable()
export class UsersService {

  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) { }

  async create(createUserDto: CreateUserDto) {

    const { username, email, dni, dateOfBirth, password, roles, ...toCreate } = createUserDto;

    let role: any = createUserDto.roles

    try {
      const isValid = await this.validation(username, email, dni);
      if (!isValid) {
        const userDto = this.userRepository.create({
          ...toCreate,
          password: bcrypt.hashSync(password, 10)
        });

        userDto.username = username
        userDto.email = email
        userDto.dni = dni
        userDto.dateOfBirth = this.newFormatDate(dateOfBirth);
        userDto.createdAt = this.formatDate(new Date());
        userDto.active = true;
        userDto.roles = role.toString();

        let userResult: any;
        await this.entityManager.transaction(async (transaction) => {
          try {
            userResult = await transaction.save(userDto);
            delete userResult.password;
          } catch (error) {
            console.log(error);
            throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
        return {
          status: HttpStatus.CREATED,
          data: userResult,
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el username o email ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true } //! OJO!
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;

  }

  async checkAuthStatus(user: User) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  async validation(username, email, dni) {
    const userFound = await this.userRepository.findOne({
      where: [{ username: username }, { email: email }, { dni: dni }]
    });

    if (!userFound) {
      return false;
    } else {
      return true;
    }
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
  }

  async findAll() {
    const users = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth', 'User.active', 'User.roles'])
      .where('User.active = 1')
      .getMany()
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth', 'User.roles'])
      .where('User.id = :id', { id: id })
      .andWhere('User.active = 1')
      .getOne()
    if (!user) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un usuario con el id ${id} ingresado o esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return user;
    }
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth', 'User.roles'])
      .where('User.email = :email', { email: email })
      .andWhere('User.active = 1')
      .getOne()
    return user;

  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: updateUserDto.id, active: true } });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `El usuario con ID= ${updateUserDto.id} no fue encontrado`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Verifica si el usuario está intentando cambiar el username y si el nuevo valor es diferente
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      // Verifica si ya existe un usuario con el mismo nuevo username
      const isUsernameDuplicate = await this.validation(updateUserDto.username, null, null);

      if (isUsernameDuplicate) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el nuevo username ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Verifica si el usuario está intentando cambiar el email y si el nuevo valor es diferente
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      // Verifica si ya existe un usuario con el mismo nuevo email
      const isEmailDuplicate = await this.validation(null, updateUserDto.email, null);

      if (isEmailDuplicate) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el nuevo email ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Verifica si el usuario está intentando cambiar el dni y si el nuevo valor es diferente
    if (updateUserDto.dni && updateUserDto.dni !== user.dni) {
      // Verifica si ya existe un usuario con el mismo nuevo dni
      const isDniDuplicate = await this.validation(null, null, updateUserDto.dni);

      if (isDniDuplicate) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el nuevo dni ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Si no hay duplicados en ninguno de los campos editados, procede con la actualización
    const updatedUser = await this.userRepository.preload({
      id: updateUserDto.id,
      ...updateUserDto,
    });

    let userResult: any;
    await this.entityManager.transaction(async (transaction) => {
      try {
        userResult = await transaction.save(updatedUser);
        delete userResult.password;
      } catch (error) {
        console.log(error);
        throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    return {
      status: HttpStatus.OK,
      data: userResult,
    };
  }

  async remove(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth'])
      .where('User.id = :id', { id: updateUserDto.id })
      .andWhere('User.active = 1')
      .getOne()
    if (!user) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un usuario con el id ${updateUserDto.id} ingresado o ya esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      user.active = false
      this.userRepository.save(user)
      return user;
    }

  }

  private newFormatDate(dateOfBirth: string) {
    // Comprueba si la fecha ya tiene el formato AAAA-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      return dateOfBirth; // No es necesario volver a formatear
    }

    // Si no tiene el formato, intenta formatearla
    const dateParts = dateOfBirth.split('-');
    if (dateParts.length === 3) {
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      return formattedDate;
    } else {
      throw new Error('Formato de fecha no válido');
    }
  }

  private formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

}
