import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/entities/order.entity';
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

  async getOrderById(orderId: string): Promise<ItemResponseData<Order>> {
    const order = await this.orderRepository.findOne({where: {id: orderId}});
    if(!order){
      throw new NotFoundException('Order not found');
    }
    return {
      data: order,
      message: 'Order fetched successfully',
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<ItemResponseData<Order>> {
    const order = await this.orderRepository.findOne({where: {id: orderId}});
    if(!order){
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    await this.orderRepository.save(order);
    return {
      data: order,
      message: 'Order status updated successfully',
    };
  }
}
