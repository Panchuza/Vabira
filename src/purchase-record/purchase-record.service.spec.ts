import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRecordService } from './purchase-record.service';

describe('PurchaseRecordService', () => {
  let service: PurchaseRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseRecordService],
    }).compile();

    service = module.get<PurchaseRecordService>(PurchaseRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
