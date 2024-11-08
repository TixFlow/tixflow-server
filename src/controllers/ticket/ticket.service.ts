import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket, TicketStatus } from 'src/entities/ticket.entity';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { CreateTicketRequestBody, UpdateTicketRequestBody } from './ticket.dto';
import { Blog } from 'src/entities/blog.entity';
import { User, UserRole } from 'src/entities/user.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async getAllTickets({
    page,
    size,
    search,
    minPrice,
    maxPrice,
    location,
    fromDate,
    toDate,
  }: {
    page: number;
    size: number;
    search: string;
    minPrice: number;
    maxPrice: number;
    location: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<ListResponseData<Ticket>> {
    const skip = (page - 1) * size;
    const take = size;
    const _fromDate = fromDate ? new Date(fromDate) : undefined;
    const _toDate = toDate ? new Date(toDate) : undefined;
    const total = await this.ticketRepository.count({
      where: {
        title: search ? Like(`%${search}%`) : undefined,
        price:
          minPrice && maxPrice
            ? Between(minPrice, maxPrice)
            : minPrice
            ? MoreThanOrEqual(minPrice)
            : maxPrice
            ? LessThanOrEqual(maxPrice)
            : undefined,
        location: location ? Like(`%${location}%`) : undefined,
        expiryDate:
          fromDate && toDate
            ? Between(_fromDate, _toDate)
            : fromDate
            ? MoreThanOrEqual(_fromDate)
            : toDate
            ? LessThanOrEqual(_toDate)
            : undefined,
        status: Not(TicketStatus.Removed),
      },
    });
    const totalPage = Math.ceil(total / size);
    const data = await this.ticketRepository.find({
      skip,
      take,
      where: {
        title: search ? Like(`%${search}%`) : undefined,
        price:
          minPrice && maxPrice
            ? Between(minPrice, maxPrice)
            : minPrice
            ? MoreThanOrEqual(minPrice)
            : maxPrice
            ? LessThanOrEqual(maxPrice)
            : undefined,
        expiryDate:
          fromDate && toDate
            ? Between(_fromDate, _toDate)
            : fromDate
            ? MoreThanOrEqual(_fromDate)
            : toDate
            ? LessThanOrEqual(_toDate)
            : undefined,
        location: location ? Like(`%${location}%`) : undefined,
        status: Not(TicketStatus.Removed),
      },
    });
    return {
      page,
      size,
      total,
      totalPage,
      data,
      message: 'Tickets fetched successfully',
    };
  }

  async getTicketById(id: string): Promise<ItemResponseData<Ticket>> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return {
      data: ticket,
      message: 'Ticket fetched successfully',
    };
  }

  async createTicket({
    userId,
    body,
  }: {
    userId: string;
    body: CreateTicketRequestBody;
  }): Promise<ItemResponseData<Ticket>> {
    const blog = await this.blogRepository.findOne({
      where: { id: body.blogId },
    });
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }
    const { expiryDate, ...rest } = body;
    const formettedExpiryDate = new Date(expiryDate);
    const _ticket = {
      ...rest,
      expiryDate: formettedExpiryDate,
      userId,
    };
    const ticket = await this.ticketRepository.save(_ticket);
    return {
      data: ticket,
      message: 'Ticket created successfully',
    };
  }

  async updateTicket(
    user: User,
    id: string,
    body: UpdateTicketRequestBody,
  ): Promise<ItemResponseData<Ticket>> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (
      user.role !== UserRole.Admin &&
      user.role !== UserRole.Moderator &&
      user.id !== ticket.userId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to update this ticket',
      );
    }
    const { expiryDate, ...rest } = body;
    const formattedExpiryDate = expiryDate ? new Date(expiryDate) : undefined;
    ticket.expiryDate = formattedExpiryDate;
    ticket.updatedAt = new Date();
    ticket.title = rest.title || ticket.title;
    ticket.description = rest.description || ticket.description;
    ticket.location = rest.location || ticket.location;
    ticket.code = rest.code || ticket.code;
    ticket.imageUrl = rest.imageUrl || ticket.imageUrl;
    ticket.price = rest.price || ticket.price;
    await this.ticketRepository.save({ ...ticket });
    const updatedTicket = await this.ticketRepository.findOne({
      where: { id },
    });
    return {
      data: updatedTicket,
      message: 'Ticket updated successfully',
    };
  }

  async removeTicket(
    id: string,
    user: User,
  ): Promise<ItemResponseData<Ticket>> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (
      user.role !== UserRole.Admin &&
      user.role !== UserRole.Moderator &&
      user.id !== ticket.userId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to delete this ticket',
      );
    }
    if (ticket.status === TicketStatus.Removed) {
      throw new BadRequestException('Ticket already deleted');
    }
    await this.ticketRepository.save({
      ...ticket,
      status: TicketStatus.Removed,
    });
    return {
      data: ticket,
      message: 'Ticket deleted successfully',
    };
  }

  async getMyTickets({
    user,
    page,
    size,
  }: {
    user: User;
    page: number;
    size: number;
  }): Promise<ListResponseData<Ticket>> {
    const skip = (page - 1) * size;
    const take = size;
    const total = await this.ticketRepository.count({
      where: { userId: user.id },
    });
    const totalPage = Math.ceil(total / size);
    const data = await this.ticketRepository.find({
      skip,
      take,
      where: { userId: user.id },
    });
    return {
      page,
      size,
      total,
      totalPage,
      data,
      message: 'Tickets fetched successfully',
    };
  }

  async getMyBoughtTickets({
    user,
    page,
    size,
  }: {
    user: User;
    page: number;
    size: number;
  }): Promise<ListResponseData<Ticket>> {
    const skip = (page - 1) * size;
    const take = size;
    const total = await this.ticketRepository.count({
      where: { boughtBy: user.id },
    });
    const totalPage = Math.ceil(total / size);
    const data = await this.ticketRepository.find({
      skip,
      take,
      where: { boughtBy: user.id },
    });
    return {
      page,
      size,
      total,
      totalPage,
      data,
      message: 'Tickets fetched successfully',
    };
  }

  async updateTicketStatus(
    id: string,
    status: TicketStatus,
  ): Promise<ItemResponseData<Ticket>> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    ticket.status = status;
    await this.ticketRepository.save(ticket);
    return {
      data: ticket,
      message: 'Ticket status updated successfully',
    };
  }

  async buyTicket(userId: string, ticketId: string): Promise<ItemResponseData<Ticket>> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.status === TicketStatus.Removed) {
      throw new BadRequestException('Ticket not available');
    }
    ticket.status = TicketStatus.Sold;
    ticket.boughtBy = userId;
    await this.ticketRepository.save(ticket);
    return {
      data: ticket,
      message: 'Ticket bought successfully',
    };
  }
}
