import { Test, TestingModule } from '@nestjs/testing';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import {
  productCoupon,
  productCoupons,
} from 'src/common/constants/product.constants';
import { CouponAppliedDto } from 'src/order/dto/coupon-applied.dto';

describe('CouponController', () => {
  let controller: CouponController;
  let service: CouponService;

  const mockCouponService = {
    getCouponList: jest.fn(() => productCoupons),
    checkAppliedCode: jest.fn((dto) => ({
      isValid: dto.code === productCoupon.FIRST50,
      discountPercentage: dto.code === productCoupon.FIRST50 ? 10 : 0,
      message:
        dto.code === productCoupon.FIRST50
          ? 'Coupon applied successfully'
          : 'Invalid coupon code',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponController],
      providers: [
        {
          provide: CouponService,
          useValue: mockCouponService,
        },
      ],
    }).compile();

    controller = module.get<CouponController>(CouponController);
    service = module.get<CouponService>(CouponService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCouponList', () => {
    it('should return a list of coupons', async () => {
      const result = await controller.getCouponList();
      expect(result).toEqual(productCoupons);
      expect(service.getCouponList).toHaveBeenCalled();
    });
  });

  describe('checkAppliedCode', () => {
    it('should return valid coupon details for a correct coupon code', async () => {
      const dto: CouponAppliedDto = {
        productEntryId: '667c03d7e44af51b74c47029',
        email: 'test@gmail.com',
        couponId: '667c03d7e44af51b74c4702a',
      };
      const result = await controller.checkAppliedCode(dto);
      expect(result).toEqual({
        isValid: true,
        message: 'Coupon applied successfully',
        discountPercentage: 10,
      });
      expect(service.checkAppliedCode).toHaveBeenCalledWith(dto);
    });

    it('should return invalid coupon details for an incorrect coupon code', async () => {
      const dto: CouponAppliedDto = {
        productEntryId: '667c03d7e44af51b74c47029',
        email: 'test@gmail.com',
        couponId: '667c03d7e44af51b74c4702a',
      };
      const result = await controller.checkAppliedCode(dto);
      expect(result).toEqual({
        isValid: false,
        discountPercentage: 0,
        message: 'Invalid coupon code',
      });
      expect(service.checkAppliedCode).toHaveBeenCalledWith(dto);
    });
  });
});
