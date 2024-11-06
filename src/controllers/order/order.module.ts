import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "src/entities/blog.entity";
import { Ticket } from "src/entities/ticket.entity";
import { User } from "src/entities/user.entity";
import { UserService } from "../user/user.service";
import { TicketService } from "../ticket/ticket.service";
import { OrderService } from "./order.service";
import { BlogService } from "../blog/blog.service";
import { OrderController } from "./order.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([User,Ticket,Blog])
    ],
    controllers:[
        OrderController
    ],
    providers:[
        JwtService,
        UserService,
        TicketService,
        OrderService,
    ]
})
export class OrderModule{}