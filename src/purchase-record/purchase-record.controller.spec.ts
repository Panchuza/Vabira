import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRecordController } from './purchase-record.controller';
import { PurchaseRecordService } from './purchase-record.service';

describe('PurchaseRecordController', () => {
  let controller: PurchaseRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseRecordController],
      providers: [PurchaseRecordService],
    }).compile();

    controller = module.get<PurchaseRecordController>(PurchaseRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
