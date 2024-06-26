export enum productName {
  T_SHIRT = 'T-shirt',
  JEANS = 'Jeans',
}

export enum productCoupon {
  FIRST50 = 'FIRST50',
  PATRON50 = 'PATRON50',
  REPEAT80 = 'REPEAT80',
}

export const productSizes = [
  { name: 'S', sequence: 1 },
  { name: 'M', sequence: 2 },
  { name: 'L', sequence: 3 },
  { name: 'XL', sequence: 4 },
  { name: 'XXL', sequence: 5 },
];

export const productColor = ['Red', 'Blue', 'White', 'Black'];
export const productCoupons = [
  {
    code: productCoupon.FIRST50,
    discountPercentage: 50,
    maxUsage: 1,
    description: 'The price of the item gets discounted by 50%',
  },
  {
    code: productCoupon.PATRON50,
    discountPercentage: 50,
    maxUsage: 1,
    description: 'The price of the item gets discounted by 50%',
  },
  {
    code: productCoupon.REPEAT80,
    discountPercentage: 80,
    maxUsage: Infinity,
    description: 'The price of the item gets discounted by 80%',
  },
];
