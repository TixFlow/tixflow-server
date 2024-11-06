import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TicketService } from "../ticket/ticket.service";
import { UserService } from "../user/user.service";
import { OrderService } from "../order/order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Ticket } from "src/entities/ticket.entity";
import { Order } from "src/entities/order.entity";
import { Blog } from "src/entities/blog.entity";
import { PayosController } from "./payos.controller";
import { PayosService } from "./payos.service";
import PayOS from "@payos/node";
import { TransactionService } from "../transaction/transaction.service";
import { Transaction } from "src/entities/transaction.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User,Ticket,Order,Blog, Transaction]),
    ],
    controllers: [PayosController],
    providers: [
        JwtService,
        UserService,
        TicketService,
        OrderService,
        PayosService,
        TransactionService
    ]
})
export class PayosModule {}