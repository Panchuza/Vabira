import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Client } from 'src/entities/client.entity';
import { DbException } from 'src/exception/dbException';

@Injectable()
export class ClientService {

  constructor(

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private userService: UsersService,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ){ }

  async create(createClientDto: CreateClientDto) {
    const { firstName, lastName, dateOfBirth, username, email, dni, password, roles, ...clientData } = createClientDto;

    let role: any = ['user', 'client'];
    let clientUser: any;

    try {
      let clientResult: any
      await this.entityManager.transaction(async (transaction) => {
        try {
          clientUser = await this.userService.create({
            firstName,
            lastName,
            dateOfBirth,
            username,
            email,
            dni,
            password,
            roles: role.toString(),
          });

          const client = this.clientRepository.create({
            ...clientData,
            user: clientUser.data,
          });
          clientResult = await transaction.save(client);
        } catch (error) {
          console.log(error);
          throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
      return {
        status: HttpStatus.CREATED,
        data: clientResult,
      }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all client`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} client`;
  // }

  async findOneUserId(id: number) {
    const client = await this.clientRepository.createQueryBuilder('Client')
      .select(['Client.id', 'Client.User_Id'])
      .where('Client.User_Id = :id', { id: id })
      .getOne()
    if (!client) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un cliente con el id ${id} ingresado o esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return client;
    }
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
