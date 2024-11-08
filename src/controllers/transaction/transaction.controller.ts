import { Controller, Param, Put } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { OrderService } from '../order/order.service';
import { TicketService } from '../ticket/ticket.service';
import { TransactionStatus } from 'src/entities/transaction.entity';
import { OrderStatus } from 'src/entities/order.entity';
import { TicketStatus } from 'src/entities/ticket.entity';

@Controller('transactions')
@ApiTags('Transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly orderService: OrderService,
    private readonly ticketService: TicketService,
  ) {}

  @Put('complete/:id')
  async completeTransaction(@Param('id') id: string) {
    const transaction = await this.transactionService.changeTransactionStatus(
      id,
      TransactionStatus.Paid,
    );
    const order = await this.orderService.updateOrderStatus(
      transaction.data.orderId,
      OrderStatus.Success,
    );
    await this.ticketService.updateTicketStatus(
      order.data.ticketId,
      TicketStatus.Sold,
    );
    await this.ticketService.buyTicket(order.data.userId, order.data.ticketId);
    return transaction;
  }

  @Put('cancel/:id')
  async cancelTransaction(@Param('id') id: string) {
    const transaction = await this.transactionService.changeTransactionStatus(
      id,
      TransactionStatus.Cancelled,
    );
    const order = await this.orderService.updateOrderStatus(
      transaction.data.orderId,
      OrderStatus.Cancelled,
    );
    await this.ticketService.updateTicketStatus(
      order.data.ticketId,
      TicketStatus.Verified,
    );
    return transaction;
  }
}
