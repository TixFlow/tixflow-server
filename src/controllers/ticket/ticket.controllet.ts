import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { UserService } from '../user/user.service';
import { BlogService } from '../blog/blog.service';
import { Category } from 'src/entities/blog.entity';
import { UserId } from 'src/decorators/user.decorator';
import { CreateTicketRequestBody } from './ticket.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { UserRole } from 'src/entities/user.entity';

@ApiTags('Ticket')
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  async getAllTickets(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('search') search: string = null,
    @Query('minPrice') minPrice: number = null,
    @Query('maxPrice') maxPrice: number = null,
    @Query('location') location: string = null,
  ) {
    return await this.ticketService.getAllTickets({
      page,
      size,
      search,
      minPrice,
      maxPrice,
      location,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by id' })
  async getTicketById(@Param('id') id: string) {
    return await this.ticketService.getTicketById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create ticket' })
  async craeteTicket(
    @UserId() userId: string,
    @Body() body: CreateTicketRequestBody,
  ) {
    return await this.ticketService.createTicket({ userId, body });
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update ticket' })
  async updateTicket(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: CreateTicketRequestBody,
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.ticketService.updateTicket(user, id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete ticket' })
  async deleteTicket(@UserId() userId: string, @Param('id') id: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.ticketService.removeTicket(id, user);
  }
}
