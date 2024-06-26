export const QUERY_KEYS = {
  product_list: ['product-list'],
  product_detail: (id: string) => [`product-detail-${id}`],
  coupon_list: ['coupon'],
  coupon_applied: ['coupon_applied'],
  order_confirmed: ['order_confirmed'],
  order_detail: (id: string) => [`order-detail-${id}`]
};
