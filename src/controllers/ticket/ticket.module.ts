import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "src/entities/blog.entity";
import { Ticket } from "src/entities/ticket.entity";
import { User } from "src/entities/user.entity";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controllet";
import { UserService } from "../user/user.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([Ticket, User, Blog])
    ],
    controllers: [TicketController],
    providers: [
        JwtService,
        TicketService,
        UserService
    ]
})
export class TicketModule{

}