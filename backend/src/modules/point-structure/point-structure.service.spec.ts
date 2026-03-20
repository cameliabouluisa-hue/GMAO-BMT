import { Test, TestingModule } from '@nestjs/testing';
import { PointStructureService } from './point-structure.service';

describe('PointStructureService', () => {
  let service: PointStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointStructureService],
    }).compile();

    service = module.get<PointStructureService>(PointStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
