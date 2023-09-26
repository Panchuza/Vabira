import { Test, TestingModule } from '@nestjs/testing';
import { PoliticalDivisionController } from './political-division.controller';
import { PoliticalDivisionService } from './political-division.service';

describe('PoliticalDivisionController', () => {
  let controller: PoliticalDivisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliticalDivisionController],
      providers: [PoliticalDivisionService],
    }).compile();

    controller = module.get<PoliticalDivisionController>(PoliticalDivisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
