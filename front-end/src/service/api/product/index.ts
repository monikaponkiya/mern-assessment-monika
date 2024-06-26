import { apiInstance } from '..';
import {
  CHECK_APPLIED_COUPON,
  COUPON_LIST_API,
  CREATE_ORDER,
  ORDER_DETAILS,
  PRODUCT_DETAILS,
  PRODUCT_LIST_APT
} from '../../../utils/constant';
import {
  ICoupon,
  ICouponApplied,
  ICouponReq,
  IOrderConfirmed,
  IOrderReq,
  IOrderSummary,
  IProduct,
  IProductDetail
} from './type';

export const productApi = {
  async productList(): Promise<IProduct[]> {
    return apiInstance
      .post(PRODUCT_LIST_APT)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getProductDetails(productId: string): Promise<IProductDetail> {
    return apiInstance
      .get(PRODUCT_DETAILS + productId)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getCouponList(): Promise<ICoupon[]> {
    return apiInstance
      .get(COUPON_LIST_API)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async checkAppliedCode(values: ICouponReq): Promise<ICouponApplied> {
    return apiInstance
      .post(CHECK_APPLIED_COUPON, values)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async orderConfirmed(values: IOrderReq): Promise<IOrderConfirmed> {
    return apiInstance
      .post(CREATE_ORDER, values)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getOrderDetails(orderId: string): Promise<IOrderSummary> {
    return apiInstance
      .get(ORDER_DETAILS + orderId)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
