import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSync } from 'bcrypt'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { DbException } from 'src/exception/dbException';

@Injectable()
export class UsersService {

  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) {}

  async create(createUserDto: CreateUserDto) {
    let userDto = new User;
    const { username, email, ...toCreate } = createUserDto;
    
    try {
      const isValid = await this.validation(username, email);
      
      if (!isValid) {
        userDto.dni = toCreate.dni;
        userDto.password = await hashSync(toCreate.password, 8);
        userDto.username = username;
        userDto.email = email;
        userDto.firstName = toCreate.firstName;
        userDto.lastName = toCreate.lastName;
        userDto.dateOfBirth = toCreate.dateOfBirth;
        userDto.createdAt = this.formatDate(new Date());
        userDto.active = true;
  
        let userResult: any;
        await this.entityManager.transaction(async (transaction) => {
          try {
            userResult = await transaction.save(userDto);
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
  
  async validation(username, email) {
      const userFound = await this.userRepository.findOne({
        where: [{ username: username }, { email: email }]
      });
  
      if (!userFound) {
        return false;
      } else {
        return true;
      }
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
    .where('User.id = :id', {id: id})
    .andWhere('User.active = 1')
    .getOne()
    if(!user){
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.createQueryBuilder('User')
    .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
    , 'User.dni', 'User.dateOfBirth'])
    .where('User.id = :id', {id: updateUserDto.id})
    .andWhere('User.active = 1')
    .getOne()
    if(!user){
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
