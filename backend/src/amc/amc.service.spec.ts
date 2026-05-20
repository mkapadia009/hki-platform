import { Test, TestingModule } from '@nestjs/testing';
import { AmcService } from './amc.service';

describe('AmcService', () => {
  let service: AmcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmcService],
    }).compile();

    service = module.get<AmcService>(AmcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
