import { Test, TestingModule } from '@nestjs/testing';
import { ProductEntriesController } from './product-entries.controller';
import { ProductEntriesService } from './product-entries.service';
import { statusOk } from 'src/common/constants/response.status.constant';
import { PRODUCT_LIST } from 'src/common/constants/response.constants';

describe('ProductEntriesController', () => {
  let controller: ProductEntriesController;
  let service: ProductEntriesService;

  const mockProductEntriesService = {
    findAllProduct: jest.fn(() => [
      { id: '1', productName: 'Product 1' },
      { id: '2', productName: 'Product 2' },
    ]),
    getProductDetails: jest.fn((productId) => ({
      id: productId,
      productName: `Product ${productId}`,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductEntriesController],
      providers: [
        {
          provide: ProductEntriesService,
          useValue: mockProductEntriesService,
        },
      ],
    }).compile();

    controller = module.get<ProductEntriesController>(ProductEntriesController);
    service = module.get<ProductEntriesService>(ProductEntriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProductList', () => {
    it('should return a list of products', async () => {
      const result = await controller.getProductList();
      expect(result).toEqual([
        { id: '1', productName: 'Product 1' },
        { id: '2', productName: 'Product 2' },
      ]);
      expect(service.findAllProduct).toHaveBeenCalled();
    });
  });

  describe('getProductDetails', () => {
    it('should return product details for a given product ID', async () => {
      const productId = '1';
      const result = await controller.getProductDetails(productId);
      expect(result).toEqual({
        id: productId,
        productName: `Product ${productId}`,
      });
      expect(service.getProductDetails).toHaveBeenCalledWith(productId);
    });
  });
});
