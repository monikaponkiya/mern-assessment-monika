import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { tableLookup } from 'src/common/aggregationHelper';
import { ORDER_NOT_FOUND } from 'src/common/constants/response.constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(orderDto: CreateOrderDto) {
    try {
      const userExist = await this.userModel.findOne({ email: orderDto.email });
      if (!userExist) {
        await this.userModel.create({ email: orderDto.email });
      }
      const createdOrder = await this.orderModel.create(orderDto);
      return { _id: createdOrder._id };
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async getOrderDetails(orderId: string) {
    try {
      const orderData = await this.orderModel.findOne({
        _id: new mongoose.Types.ObjectId(orderId),
      });
      if (!orderData) {
        throw AuthExceptions.customException(ORDER_NOT_FOUND, statusBadRequest);
      }
      const aggregateQuery = [];

      aggregateQuery.push({
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      });

      tableLookup(
        aggregateQuery,
        'productEntries',
        'productEntryId',
        '_id',
        'productEntries',
        true,
      );
      tableLookup(
        aggregateQuery,
        'products',
        'productEntries.productId',
        '_id',
        'productDetail',
        true,
      );
      tableLookup(
        aggregateQuery,
        'sizes',
        'productEntries.sizeId',
        '_id',
        'size',
        true,
      );
      tableLookup(
        aggregateQuery,
        'colors',
        'productEntries.colorId',
        '_id',
        'color',
        true,
      );

      aggregateQuery.push({
        $group: {
          _id: '$_id',
          productEntryId: {
            $first: '$productEntryId',
          },
          email: {
            $first: '$email',
          },
          orderValue: {
            $first: '$orderValue',
          },
          productName: {
            $first: '$productDetail.productName',
          },
          productDescription: {
            $first: '$productDetail.productDescription',
          },
          productImage: {
            $first: '$productDetail.productImage',
          },
          size: {
            $first: '$size.name',
          },
          color: {
            $first: '$color.name',
          },
        },
      });
      const userOrder = await this.orderModel.aggregate(aggregateQuery);
      return userOrder[0];
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
