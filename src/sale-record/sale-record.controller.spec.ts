import { Test, TestingModule } from '@nestjs/testing';
import { SaleRecordController } from './sale-record.controller';
import { SaleRecordService } from './sale-record.service';

describe('SaleRecordController', () => {
  let controller: SaleRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleRecordController],
      providers: [SaleRecordService],
    }).compile();

    controller = module.get<SaleRecordController>(SaleRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
