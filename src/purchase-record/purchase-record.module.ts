import { Module } from '@nestjs/common';
import { PurchaseRecordService } from './purchase-record.service';
import { PurchaseRecordController } from './purchase-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRecord } from 'src/entities/purchaseRecord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRecord])],
  controllers: [PurchaseRecordController],
  providers: [PurchaseRecordService]
})
export class PurchaseRecordModule {}
