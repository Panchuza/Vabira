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

    const { username, email, dni, dateOfBirth, password, ...toCreate } = createUserDto;
    
    let roles:any = ['user']

    try {
      const isValid = await this.validation(username, email, dni);
      if (!isValid) {
        const userDto = this.userRepository.create({
          ...toCreate,
          password: bcrypt.hashSync( password, 10 )
        });
        
        userDto.username = username
        userDto.email = email
        userDto.dni = dni
        userDto.dateOfBirth = this.newFormatDate(dateOfBirth);
        userDto.createdAt = this.formatDate(new Date());
        userDto.active = true;
        userDto.roles = roles.toString();

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
        return userResult;
      } else {
        return new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Ya existe un usuario con el username o email ingresado',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login( loginUserDto: LoginDto ) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true } //! OJO!
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    
    return token;

  }

  async checkAuthStatus( user: User ){

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
        , 'User.dni', 'User.dateOfBirth', 'User.active'])
      .where('User.active = 1')
      .getMany()
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth'])
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
        , 'User.dni', 'User.dateOfBirth'])
      .addSelect(['TypeRole.codTypeRole', 'TypeRole.txtTypeRole'])
      .leftJoin('User.typeRole', 'TypeRole')
      .where('User.email = :email', { email: email })
      .andWhere('User.active = 1')
      .getOne()
      return user;

  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({where: {id: updateUserDto.id, active: true}})
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
    const dateParts = dateOfBirth.split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    return formattedDate
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
