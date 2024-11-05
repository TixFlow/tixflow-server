import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { TicketService } from "./ticket.service";
import { UserService } from "../user/user.service";
import { BlogService } from "../blog/blog.service";
import { Category } from "src/entities/blog.entity";

@ApiTags('Ticket')
@Controller('tickets')
export class TicketController{
    constructor(
        private readonly ticketService: TicketService,
        private readonly userService: UserService,
        private readonly blogService: BlogService,
    ){}

    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'size', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    async getAllTickets(
        @Query('page') page: number = 1,
        @Query('size') size: number = 10,
        @Query('search') search: string = null,
        @Query('minPrice') minPrice: number = null,
        @Query('maxPrice') maxPrice: number = null,
        @Query('location') location: string = null,
    ){
        return await this.ticketService.getAllTickets({ page, size, search, minPrice, maxPrice, location });
    }
}