import { Test, TestingModule } from '@nestjs/testing';
import { ProductEntriesService } from './product-entries.service';

describe('ProductEntriesService', () => {
  let service: ProductEntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductEntriesService],
    }).compile();

    service = module.get<ProductEntriesService>(ProductEntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
