import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaleRecordDto } from './dto/create-sale-record.dto';
import { UpdateSaleRecordDto } from './dto/update-sale-record.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DbException } from 'src/exception/dbException';
import { SaleRecord } from 'src/entities/saleRecord.entity';
import { EntityManager, Repository } from 'typeorm';
import { Client } from 'src/entities/client.entity';
import { Supplier } from 'src/entities/supplier.entity';

@Injectable()
export class SaleRecordService {

  constructor(
    @InjectRepository(SaleRecord)
    private readonly saleRecordRepository: Repository<SaleRecord>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectEntityManager()
    private entityManager: EntityManager
  ) { }

  async create(createSaleRecordDto: CreateSaleRecordDto) {

    const {client, supplier, ...toCreate} = createSaleRecordDto
    const clientFound = await this.clientRepository.findOne({where: {id: client.id}})
    const supplierFound = await this.supplierRepository.findOne({where: {id: client.id}})
    try {
        const saleRecord = await this.saleRecordRepository.create({
          client,
          supplier, 
          ...toCreate
        })
        saleRecord.client = clientFound
        saleRecord.supplier = supplierFound
        saleRecord.saleDateTime = toCreate.saleDateTime
        saleRecord.saleAmount = toCreate.saleAmount
        saleRecord.quantity = toCreate.quantity

        let result: SaleRecord
        await this.entityManager.transaction(async (transaction) => {
          try {
            result = await transaction.save(saleRecord)

          } catch (error) {
            console.log(error);
            throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        })
        return {
          status: HttpStatus.CREATED,
          data: result,
        }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const products = await this.saleRecordRepository.createQueryBuilder('SaleRecord')
      .select(['SaleRecord.id', 'SaleRecord.saleDateTime', 'SaleRecord.saleAmount', 'SaleRecord.quantity', 'SaleRecord.supplier', 'SaleRecord.client'])
      .getMany();
    return products
  }

  findOne(id: number) {
    return `This action returns a #${id} saleRecord`;
  }

  update(id: number, updateSaleRecordDto: UpdateSaleRecordDto) {
    return `This action updates a #${id} saleRecord`;
  }

  async remove(updateSaleRecordDto: UpdateSaleRecordDto) {    
    const saleRecord = await this.saleRecordRepository.findOne({ where: { id: updateSaleRecordDto.id } })
    
    if (saleRecord) {
      await this.saleRecordRepository.remove(saleRecord)
    } else {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe una venta con el id ${saleRecord.id} ingresado o ya esta dada de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
