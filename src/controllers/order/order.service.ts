import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { ItemResponseData } from '../base.dto';
import { User } from 'src/entities/user.entity';
import { CreateOrderRequestBody } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder({
    user,
    body,
  }: {
    user: User;
    body: CreateOrderRequestBody;
  }): Promise<ItemResponseData<Order>> {
    const order = await this.orderRepository.save({
      ...body,
      userId: user.id,
    });
    return {
      data: order,
      message: 'Order created successfully',
    };
  }
}
