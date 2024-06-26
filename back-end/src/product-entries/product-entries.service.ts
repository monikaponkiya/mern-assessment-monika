import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductEntries,
  ProductEntriesDocument,
} from './schema/product-entries.schema';
import mongoose, { Model } from 'mongoose';
import { Size, SizeDocument } from 'src/sizes/schema/size.schema';
import { Color, ColorDocument } from 'src/colors/schema/color.schema';
import { Product, ProductDocument } from 'src/products/schema/product.schema';
import {
  productColor,
  productCoupons,
  productName,
  productSizes,
} from 'src/common/constants/product.constants';
import { Coupon, CouponDocument } from 'src/coupon/schema/coupon.schema';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { PRODUCT_NOT_EXIST } from 'src/common/constants/response.constants';
import { tableLookup } from 'src/common/aggregationHelper';

@Injectable()
export class ProductEntriesService {
  constructor(
    @InjectModel(ProductEntries.name)
    private productEntriesModel: Model<ProductEntriesDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Size.name)
    private sizeModel: Model<SizeDocument>,
    @InjectModel(Color.name)
    private colorModel: Model<ColorDocument>,
    @InjectModel(Coupon.name)
    private couponModel: Model<CouponDocument>,
  ) {}

  async createInitialProductEntries() {
    const productCount = await this.productModel.countDocuments({});
    const sizeCount = await this.sizeModel.countDocuments({});
    const colorCount = await this.colorModel.countDocuments({});
    const couponCount = await this.couponModel.countDocuments({});
    const productEntriesCount = await this.productEntriesModel.countDocuments(
      {},
    );

    if (
      productCount === 0 &&
      sizeCount === 0 &&
      colorCount === 0 &&
      couponCount === 0 &&
      productEntriesCount === 0
    ) {
      const sizes = productSizes;
      const colors = productColor;
      const coupon = productCoupons;

      const sizeDocs = await this.sizeModel.insertMany(
        sizes.map((size) => ({ name: size.name, sequence: size.sequence })),
      );
      const colorDocs = await this.colorModel.insertMany(
        colors.map((name) => ({ name })),
      );

      await this.couponModel.insertMany(coupon);

      const tShirt = await this.productModel.create({
        productName: productName.T_SHIRT,
        productDescription: 'Trendy elegant women T-shirt',
        productImage: 't-shirt.jpeg',
        productRate: 4,
      });

      const jeans = await this.productModel.create({
        productName: productName.JEANS,
        productDescription: 'Trendy elegant women Jeans',
        productImage: 'jeans.jpeg',
        productRate: 3,
      });

      const priceChart1 = {
        Red: [20, 30, 40, 50, 60],
        Blue: [70, 80, 90, 100, 110],
        White: [120, 130, 140, null, null],
        Black: [150, 160, 170, 180, null],
      };

      const priceChart2 = {
        White: [100, 200, null],
        Black: [null, 300, 400],
      };

      const entries1 = [];

      for (const [color, prices] of Object.entries(priceChart1)) {
        const colorId = colorDocs.find((c) => c.name === color)._id;
        for (let i = 0; i < prices.length; i++) {
          const price = prices[i];
          if (price !== null) {
            const sizeId = sizeDocs[i]._id;
            entries1.push({ productId: tShirt._id, sizeId, colorId, price });
          }
        }
      }

      await this.productEntriesModel.insertMany(entries1);

      const entries2 = [];

      for (const [color, prices] of Object.entries(priceChart2)) {
        const colorId = colorDocs.find((c) => c.name === color)._id;
        for (let i = 0; i < prices.length; i++) {
          const price = prices[i];
          if (price !== null) {
            const sizeId = sizeDocs[i]._id;
            entries2.push({ productId: jeans._id, sizeId, colorId, price });
          }
        }
      }

      await this.productEntriesModel.insertMany(entries2);
      console.log('Database seeded!');
    } else {
      console.log('Database already contains data, seeding skipped');
    }
  }

  async findAllProduct() {
    try {
      const aggregateQuery = [];

      tableLookup(
        aggregateQuery,
        'products',
        'productId',
        '_id',
        'productData',
        true,
      );

      aggregateQuery.push({
        $group: {
          _id: '$productId',
          productName: {
            $first: '$productData.productName',
          },
          productImage: {
            $first: '$productData.productImage',
          },
        },
      });
      const productList = await this.productEntriesModel.aggregate(
        aggregateQuery,
      );
      return productList;
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async getProductDetails(productId: string) {
    try {
      const isProductExist = await this.productEntriesModel.findOne({
        productId: new mongoose.Types.ObjectId(productId),
      });
      if (!isProductExist) {
        throw AuthExceptions.customException(
          PRODUCT_NOT_EXIST,
          statusBadRequest,
        );
      }
      const aggregateQuery = [];

      aggregateQuery.push({
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      });

      tableLookup(
        aggregateQuery,
        'products',
        'productId',
        '_id',
        'productData',
        true,
      );
      tableLookup(
        aggregateQuery,
        'sizes',
        'sizeId',
        '_id',
        'productSize',
        true,
      );
      tableLookup(
        aggregateQuery,
        'colors',
        'colorId',
        '_id',
        'productColor',
        true,
      );
      tableLookup(
        aggregateQuery,
        'products',
        'productId',
        '_id',
        'productData',
        true,
      );

      aggregateQuery.push(
        {
          $group: {
            _id: '$productSize._id',
            productId: {
              $first: '$productId',
            },
            productName: {
              $first: '$productData.productName',
            },
            productDescription: {
              $first: '$productData.productDescription',
            },
            productRate: {
              $first: '$productData.productRate',
            },
            productImage: {
              $first: '$productData.productImage',
            },
            size: {
              $first: '$productSize.name',
            },
            productSize: {
              $first: '$productSize',
            },
            colorAndPriceArray: {
              $push: {
                color: '$productColor.name',
                colorId: '$productColor._id',
                price: '$price',
                productEntryId: '$_id',
              },
            },
          },
        },
        {
          $sort: {
            'productSize.sequence': 1,
          },
        },
        {
          $group: {
            _id: null,
            productId: {
              $first: '$productId',
            },
            productName: {
              $first: '$productName',
            },
            productDescription: {
              $first: '$productDescription',
            },
            productRate: {
              $first: '$productRate',
            },
            productImage: {
              $first: '$productImage',
            },
            sizeWiseColorPriceArray: {
              $push: {
                _id: '$_id',
                size: '$size',
                colorAndSizeArray: '$colorAndPriceArray',
              },
            },
          },
        },
      );

      const productDetails = await this.productEntriesModel.aggregate(
        aggregateQuery,
      );

      return productDetails[0];
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
