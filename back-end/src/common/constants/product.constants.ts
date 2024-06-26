export enum productName {
  T_SHIRT = 'T-shirt',
  JEANS = 'Jeans',
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
    code: 'FIRST50',
    discountPercentage: 50,
    maxUsage: 1,
    description: 'The price of the item gets discounted by 50%',
  },
  {
    code: 'PATRON50',
    discountPercentage: 50,
    maxUsage: 1,
    description: 'The price of the item gets discounted by 50%',
  },
  {
    code: 'REPEAT80',
    discountPercentage: 80,
    maxUsage: Infinity,
    description: 'The price of the item gets discounted by 80%',
  },
];
