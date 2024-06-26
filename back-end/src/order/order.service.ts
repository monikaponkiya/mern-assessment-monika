import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';

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
        throw AuthExceptions.customException(
          'Order not found',
          statusBadRequest,
        );
      }
      const aggregateQuery = [];
      aggregateQuery.push(
        {
          $match: {
            _id: new mongoose.Types.ObjectId(orderId),
          },
        },
        {
          $lookup: {
            from: 'productEntries',
            localField: 'productEntryId',
            foreignField: '_id',
            as: 'productEntries',
          },
        },
        {
          $unwind: {
            path: '$productEntries',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productEntries.productId',
            foreignField: '_id',
            as: 'productDetail',
          },
        },
        {
          $unwind: {
            path: '$productDetail',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'sizes',
            localField: 'productEntries.sizeId',
            foreignField: '_id',
            as: 'size',
          },
        },
        {
          $unwind: {
            path: '$size',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'colors',
            localField: 'productEntries.colorId',
            foreignField: '_id',
            as: 'color',
          },
        },
        {
          $unwind: {
            path: '$color',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
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
        },
      );
      const userOrder = await this.orderModel.aggregate(aggregateQuery);
      return userOrder[0];
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
