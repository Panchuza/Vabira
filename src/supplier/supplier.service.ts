import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { UsersService } from 'src/users/users.service';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DbException } from 'src/exception/dbException';
import { Supplier } from 'src/entities/supplier.entity';

@Injectable()
export class SupplierService {

  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) { }

  async create(createSupplierDto: CreateSupplierDto) {
    const { firstName, lastName, dateOfBirth, username, email, dni, password, roles, ...supplierData } = createSupplierDto;

    let role: any = ['user', 'supplier'];
    let supplierUser: any;

    try {
      let supplierResult: any
      await this.entityManager.transaction(async (transaction) => {
        try {
          supplierUser = await this.userService.create({
            firstName,
            lastName,
            dateOfBirth,
            username,
            email,
            dni,
            password,
            roles: role.toString(),
          });

          const supplier = this.supplierRepository.create({
            ...supplierData,
            user: supplierUser.data,
          });
          supplierResult = await transaction.save(supplier);
        } catch (error) {
          console.log(error);
          throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
      return {
        status: HttpStatus.CREATED,
        data: supplierResult,
      }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const users = await this.supplierRepository.createQueryBuilder('Supplier')
      .select(['Supplier.id', 'Supplier.identificationNumber', 'Supplier.cuit'])
      .addSelect(['User.username', 'User.firstName', 'User.lastName', 'User.dni', 'User.dateOfBirth', 'User.active'])
      .leftJoin('Supplier.user', 'User')
      .where('User.active = 1')
      .getMany()
    return users;
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.createQueryBuilder('Supplier')
      .select(['Supplier.id', 'Supplier.identificationNumber', 'Supplier.cuit'])
      .addSelect(['User.username', 'User.firstName', 'User.lastName', 'User.dni', 'User.dateOfBirth', 'User.active'])
      .leftJoin('Supplier.user', 'User')
      .where('Supplier.id = :id', { id: id })
      .andWhere('User.active = 1')
      .getOne()
    if (!supplier) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un proveedor con el id ${id} ingresado o esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return supplier;
    }
  }
  
  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
