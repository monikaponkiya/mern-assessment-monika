import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  COUPON_APPLIED,
  COUPON_FIRST50,
  COUPON_NOT_APPLIED,
  COUPON_PATRON50,
  COUPON_PATRON50_4,
  COUPON_REPEAT80,
  INVALID_COUPON,
  PRODUCT_NOT_EXIST,
  USER_EMAIL,
} from 'src/common/constants/response.constants';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { CouponAppliedDto } from 'src/order/dto/coupon-applied.dto';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';
import {
  ProductEntries,
  ProductEntriesDocument,
} from 'src/product-entries/schema/product-entries.schema';
import { Coupon, CouponDocument } from './schema/coupon.schema';
import { productCoupon } from 'src/common/constants/product.constants';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private couponModel: Model<CouponDocument>,
    @InjectModel(ProductEntries.name)
    private productEntriesModel: Model<ProductEntriesDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async getCouponList() {
    try {
      const couponList = await this.couponModel.find().exec();
      return couponList;
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async checkAppliedCode(couponAppliedDto: CouponAppliedDto) {
    try {
      const productEntry = await this.productEntriesModel.findOne({
        _id: couponAppliedDto.productEntryId,
      });
      if (!productEntry) {
        throw new BadRequestException(PRODUCT_NOT_EXIST);
      }

      if (!couponAppliedDto.email) {
        throw new BadRequestException(USER_EMAIL);
      }

      const couponExist = await this.couponModel.findOne({
        _id: couponAppliedDto.couponId,
      });

      if (!couponExist) {
        throw AuthExceptions.customException(INVALID_COUPON, statusBadRequest);
      }

      const isEligible = await this.checkCouponEligibility(
        couponExist,
        couponAppliedDto,
      );

      let discountedPrice;
      let amount_payable = productEntry.price;
      let isCoupon_applied: boolean = false;

      if (isEligible) {
        isCoupon_applied = true;
        discountedPrice =
          productEntry.price -
          productEntry.price * (couponExist.discountPercentage / 100);
        amount_payable = productEntry.price - discountedPrice;
      }

      return {
        message: isCoupon_applied ? COUPON_APPLIED : COUPON_NOT_APPLIED,
        discountedPrice,
        isCoupon_applied,
        amount_payable,
      };
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async checkCouponEligibility(
    coupon: CouponDocument,
    couponAppliedDto: CouponAppliedDto,
  ): Promise<boolean> {
    const userOrdersCount = await this.orderModel.countDocuments({
      email: couponAppliedDto.email,
    });
    const couponUsageCount = await this.orderModel.countDocuments({
      email: couponAppliedDto.email,
      couponId: couponAppliedDto.couponId,
    });

    switch (coupon.code) {
      case productCoupon.FIRST50:
        if (userOrdersCount >= 1) {
          throw new BadRequestException(COUPON_FIRST50);
        }
        return true;

      case productCoupon.PATRON50:
        if (userOrdersCount < 4) {
          throw new BadRequestException(COUPON_PATRON50);
        }
        if (couponUsageCount >= 1) {
          throw new BadRequestException(COUPON_PATRON50_4);
        }
        return true;

      case productCoupon.REPEAT80:
        const repeatOrder = await this.orderModel.findOne({
          email: couponAppliedDto.email,
          productEntryId: couponAppliedDto.productEntryId,
        });
        if (!repeatOrder) {
          throw new BadRequestException(COUPON_REPEAT80);
        }
        return true;

      default:
        throw AuthExceptions.customException(INVALID_COUPON, statusBadRequest);
    }
  }
}
