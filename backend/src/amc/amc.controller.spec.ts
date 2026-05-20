import { Test, TestingModule } from '@nestjs/testing';
import { AmcController } from './amc.controller';

describe('AmcController', () => {
  let controller: AmcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmcController],
    }).compile();

    controller = module.get<AmcController>(AmcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
