import { Test, TestingModule } from '@nestjs/testing';
import { PointStructureController } from './point-structure.controller';

describe('PointStructureController', () => {
  let controller: PointStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointStructureController],
    }).compile();

    controller = module.get<PointStructureController>(PointStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
