import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateOrderRequestBody } from './order.dto';
import { UserId } from 'src/decorators/user.decorator';
import { TicketService } from '../ticket/ticket.service';
import { UserService } from '../user/user.service';
import { TicketStatus } from 'src/entities/ticket.entity';

@Controller('orders')
@ApiTags('Order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly ticketService: TicketService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Order' })
  async createOrder(
    @Body() body: CreateOrderRequestBody,
    @UserId() userId: string,
  ) {
    const user = await this.userService.getUserById(userId);
    const ticket = (await this.ticketService.getTicketById(body.ticketId)).data;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    if (
      ticket.status === TicketStatus.Removed ||
      ticket.status === TicketStatus.Sold ||
      ticket.status === TicketStatus.InProgress
    ) {
        throw new BadRequestException('Ticket not available');
    }
    return await this.orderService.createOrder({ user, body });
  }
}