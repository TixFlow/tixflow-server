import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionStatus,
} from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreatePaymentUrlBody } from './transaction.dto';
import { OrderService } from '../order/order.service';
import { TicketService } from '../ticket/ticket.service';
import { OrderStatus } from 'src/entities/order.entity';
import { TicketStatus } from 'src/entities/ticket.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(data: CreatePaymentUrlBody) {
    await this.transactionRepository.save({...data, totalAmount: data.amount});
    const transaction = await this.transactionRepository.find({
      order: { createdAt: 'ASC' },
    });
    console.log(transaction);
    return {
      data: transaction[transaction.length - 1],
      message: 'Transaction created successfully',
    };
  }

  async changeTransactionStatus(id: string, status: TransactionStatus) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    transaction.status = status;
    return {
      data: transaction,
      message: 'Transaction status updated successfully',
    };
  }
}
