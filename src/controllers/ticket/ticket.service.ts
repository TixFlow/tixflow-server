import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { ItemResponseData, ListResponseData } from '../base.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async getAllTickets({
    page,
    size,
    search,
    minPrice,
    maxPrice,
    location,
  }: {
    page: number;
    size: number;
    search: string;
    minPrice: number;
    maxPrice: number;
    location: string;
  }): Promise<ListResponseData<Ticket>> {
    const skip = (page - 1) * size;
    const take = size;
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
      },
    });
    const totalPage = Math.ceil(total / size);
    const data = await this.ticketRepository.find({ skip, take, where: {
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
    }});
    return {
      page,
      size,
      total,
      totalPage,
      data,
      message: 'Tickets fetched successfully',
    };
  }

  async getTicketById(id: string): Promise<ItemResponseData<Ticket>>{
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return {
      data: ticket,
      message: 'Ticket fetched successfully',
    };
  }
}
