import { Test, TestingModule } from '@nestjs/testing';
import { SepomexService } from './sepomex.service';

describe('SepomexService', () => {
  let service: SepomexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SepomexService],
    }).compile();

    service = module.get<SepomexService>(SepomexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
