import { Module } from '@nestjs/common';
import { SaleRecordService } from './sale-record.service';
import { SaleRecordController } from './sale-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleRecord } from 'src/entities/saleRecord.entity';
import { Client } from 'src/entities/client.entity';
import { Supplier } from 'src/entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaleRecord, Client, Supplier]),],
  controllers: [SaleRecordController],
  providers: [SaleRecordService]
})
export class SaleRecordModule {}
