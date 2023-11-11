import { Injectable } from '@nestjs/common';
import { CreatePurchaseRecordDto } from './dto/create-purchase-record.dto';
import { UpdatePurchaseRecordDto } from './dto/update-purchase-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseRecord } from 'src/entities/purchaseRecord.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseRecordService {
  constructor(
    @InjectRepository(PurchaseRecord)
    private readonly purchaseRecordRepository: Repository<PurchaseRecord>
  ){}
  create(createPurchaseRecordDto: CreatePurchaseRecordDto) {
    return 'This action adds a new purchaseRecord';
  }

  async findAll() {
    const purchaseRecords = await this.purchaseRecordRepository.find({relations: {product: true}})
    return purchaseRecords
  }

  async findOneWithProducts(id: number) {
    const purchaseRecord = await this.purchaseRecordRepository.findOne({where: {id: id}, relations: {product: true}})
    return purchaseRecord
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseRecord`;
  }

  update(id: number, updatePurchaseRecordDto: UpdatePurchaseRecordDto) {
    return `This action updates a #${id} purchaseRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseRecord`;
  }
}
