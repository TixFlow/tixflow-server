import { Body, Controller, Post } from "@nestjs/common";
import { CreatePayOsUrlBody } from "./payos.dto";
import { PayosService } from "./payos.service";
import { OrderService } from "../order/order.service";
import { TicketService } from "../ticket/ticket.service";
import { TicketStatus } from "src/entities/ticket.entity";

@Controller('payos')
export class PayosController {
    constructor(
        private readonly payosService: PayosService,
        private readonly orderService: OrderService,
        private readonly ticketService: TicketService
    ) {}

    @Post('create-payment-url')
    async createPaymentUrl(@Body() body: CreatePayOsUrlBody) {
        const transaction = await this.payosService.createPaymentUrl(body);
        const order = await this.orderService.getOrderById(body.orderId);
        await this.ticketService.updateTicketStatus(order.data.ticketId, TicketStatus.InProgress);
        return transaction;
    }
}
