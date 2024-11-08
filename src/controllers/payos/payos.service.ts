import { Injectable } from '@nestjs/common';
import { CreatePayOsUrlBody } from './payos.dto';
import { OrderService } from '../order/order.service';
import { TicketService } from '../ticket/ticket.service';
import { ItemResponseData } from '../base.dto';
import { CheckoutResponseDataType } from '@payos/node/lib/type';
import PayOS from '@payos/node';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class PayosService {
  constructor(
    private readonly orderService: OrderService,
    private readonly ticketService: TicketService,
    private readonly transactionService: TransactionService,
  ) {}

  async createPaymentUrl(
    body: CreatePayOsUrlBody,
  ): Promise<ItemResponseData<Transaction>> {
    const clientId = process.env.PAYOS_CLIENTID;
    const apiKey = process.env.PAYOS_APIKEY;
    const checksumKey = process.env.PAYOS_CHECKSUMKEY;
    const payos = new PayOS(clientId, apiKey, checksumKey);
    const order = (await this.orderService.getOrderById(body.orderId)).data;
    const ticket = (await this.ticketService.getTicketById(order.ticketId))
      .data;
    const payload = {
      orderCode: Number(String(Date.now()).slice(-6)),
      amount: body.amount,
      description: `Payment for order ${Number(String(Date.now()).slice(-6))}`,
      items: [
        {
          name: ticket.title,
          quantity: 1,
          price: ticket.price,
        },
      ],
      returnUrl: 'http://localhost:3000/payment/{ticketid}',
      cancelUrl: 'http://localhost:3000/payment/{ticketid}',
    };
    const payment = (await payos.createPaymentLink(payload));
    const transaction = (await this.transactionService.createTransaction({
        orderId: body.orderId,
        paymentUrl: payment.checkoutUrl,
        amount: body.amount,
        paymentLinkId: payment.paymentLinkId,
    })).data;
    return {
      data: transaction,
      message: 'Payment url created successfully',
    };
  }
}
