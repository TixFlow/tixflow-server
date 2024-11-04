import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "src/entities/blog.entity";
import { User } from "src/entities/user.entity";
import { Ticket } from "src/entities/ticket.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Blog,User,Ticket])
    ],
    controllers: [BlogController],
    providers: [
        JwtService,
        BlogService
    ],
})
export class BlogModule{

}