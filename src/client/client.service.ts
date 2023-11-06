import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Client } from 'src/entities/client.entity';
import { DbException } from 'src/exception/dbException';
import { plainToClass } from 'class-transformer';
import { ClientAddress } from 'src/entities/clientAddress.entity';
import { TypeService } from 'src/type/type.service';
import { Address } from 'src/entities/address.entity';

@Injectable()
export class ClientService {

  constructor(

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private userService: UsersService,
    private typeService: TypeService,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) { }

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
            profileType: 'Client'
          }, true);
          let typeAdress = await this.typeService.findTypeByCodeJust('DomicilioReal')
          clientData.clientAddress[0].address['addressType'] = typeAdress
          const client = this.clientRepository.create({
            clientAddress: clientData.clientAddress,
            user: clientUser.data
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

  async findAll() {
    const users = await this.clientRepository.createQueryBuilder('Client')
      .select('Client.id')
      .addSelect(['ClientAddress.id', 'Address.address', 'Address.postalCode', 'Country.name', 'PoliticalDivision.name'])
      .addSelect(['User.username', 'User.firstName', 'User.lastName', 'User.dni', 'User.active'])
      .leftJoin('Client.user', 'User')
      .leftJoin('Client.clientAddress', 'ClientAddress')
      .leftJoin('ClientAddress.address', 'Address')
      .leftJoin('Address.country', 'Country')
      .leftJoin('Address.politicalDivision', 'PoliticalDivision')
      .where('User.active = 1')
      .getMany()
    return users;
  }

  async findOne(id: number) {
    const client = await this.clientRepository.createQueryBuilder('Client')
      .select('Client.id')
      .addSelect(['ClientAddress.id', 'Address.address', 'Address.postalCode', 'Country.name', 'PoliticalDivision.name'])
      .addSelect(['User.username', 'User.firstName', 'User.lastName', 'User.dni', 'User.active'])
      .leftJoin('Client.user', 'User')
      .leftJoin('Client.clientAddress', 'ClientAddress')
      .leftJoin('ClientAddress.address', 'Address')
      .leftJoin('Address.country', 'Country')
      .leftJoin('Address.politicalDivision', 'PoliticalDivision')
      .where('Client.id = :id', { id: id })
      .andWhere('User.active = 1')
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

  async findOneClientByEmail(email: string) {
    const supplier = await this.clientRepository.createQueryBuilder('Client')
      .select('Client.id')
      .addSelect(['ClientAddress.id', 'Address.address', 'Address.postalCode', 'Country.name', 'PoliticalDivision.name'])
      .addSelect(['User.username', 'User.firstName', 'User.lastName', 'User.dni', 'User.active'])
      .leftJoin('Client.user', 'User')
      .leftJoin('Client.clientAddress', 'ClientAddress')
      .leftJoin('ClientAddress.address', 'Address')
      .leftJoin('Address.country', 'Country')
      .leftJoin('Address.politicalDivision', 'PoliticalDivision')
      .where('User.email = :email', { email: email })
      .andWhere('User.active = 1')
      .getOne()
    if (!supplier) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un cliente con el email ${email} ingresado o esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return supplier;
    }
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
