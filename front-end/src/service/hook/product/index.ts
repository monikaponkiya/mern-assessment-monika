import { useFetch, useRequest } from '..';
import { productApi } from '../../api/product';
import { QUERY_KEYS } from '../queryKeys';

export const useProductList = () => {
  return useFetch({
    queryFn: () => productApi.productList(),
    queryKey: QUERY_KEYS.product_list,
    queryOptions: {
      staleTime: 2 * (60 * 1000)
    }
  });
};

export const useProductDetails = (productId: string) => {
  return useFetch({
    queryFn: () => productApi.getProductDetails(productId),
    queryKey: QUERY_KEYS.product_detail(productId),
    queryOptions: {
      staleTime: Infinity
    }
  });
};

export const useCouponList = (productId: string) => {
  return useFetch({
    queryFn: () => productApi.getCouponList(),
    queryKey: QUERY_KEYS.coupon_list,
    queryOptions: {
      staleTime: 2 * (60 * 1000),
      enabled: Boolean(productId)
    }
  });
};

export const useCouponApplied = () => {
  return useRequest({
    mutationKey: QUERY_KEYS.coupon_applied,
    mutationFn: productApi.checkAppliedCode
  });
};

export const useOrderConfirmed = () => {
  return useRequest({
    mutationKey: QUERY_KEYS.order_confirmed,
    mutationFn: productApi.orderConfirmed
  });
};

export const useOrderDetails = (orderId: string) => {
  return useFetch({
    queryFn: () => productApi.getOrderDetails(orderId),
    queryKey: QUERY_KEYS.order_detail(orderId),
    queryOptions: {
      staleTime: Infinity
    }
  });
};
