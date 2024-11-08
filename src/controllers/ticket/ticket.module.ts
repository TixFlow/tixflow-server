import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "src/entities/blog.entity";
import { Ticket } from "src/entities/ticket.entity";
import { User } from "src/entities/user.entity";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { UserService } from "../user/user.service";
import { BlogService } from "../blog/blog.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([Ticket, User, Blog])
    ],
    controllers: [TicketController],
    providers: [
        JwtService,
        TicketService,
        UserService,
        BlogService
    ]
})
export class TicketModule{

}