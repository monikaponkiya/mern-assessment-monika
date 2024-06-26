import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_DETAILS } from 'src/common/constants/response.constants';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn((dto) => ({ id: '1', ...dto })),
    getOrderDetails: jest.fn((orderId) => ({
      id: orderId,
      productName: `Product ${orderId}`,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const dto: CreateOrderDto = {
        productEntryId: '1',
        email: 'test@gmail.com',
        orderValue: 20,
      };
      const result = await controller.createOrder(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('getProductDetails', () => {
    it('should return order details for a given order ID', async () => {
      const orderId = '1';
      const result = await controller.getProductDetails(orderId);
      expect(result).toEqual({
        id: orderId,
        productName: `Product ${orderId}`,
      });
      expect(service.getOrderDetails).toHaveBeenCalledWith(orderId);
    });
  });
});
