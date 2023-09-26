import { Test, TestingModule } from '@nestjs/testing';
import { PoliticalDivisionService } from './political-division.service';

describe('PoliticalDivisionService', () => {
  let service: PoliticalDivisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoliticalDivisionService],
    }).compile();

    service = module.get<PoliticalDivisionService>(PoliticalDivisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
