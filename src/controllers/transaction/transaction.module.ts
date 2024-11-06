import { Module } from "@nestjs/common";
import { OrderService } from "../order/order.service";
import { JwtService } from "@nestjs/jwt";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { Transaction } from "src/entities/transaction.entity";
import { User } from "src/entities/user.entity";
import { Ticket } from "src/entities/ticket.entity";
import { TicketService } from "../ticket/ticket.service";
import { Blog } from "src/entities/blog.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Transaction, User, Ticket, Blog])
    ],
    controllers: [
        TransactionController
    ],
    providers: [
        JwtService,
        OrderService,
        TransactionService,
        TicketService
    ]
})
export class TransactionModule{}