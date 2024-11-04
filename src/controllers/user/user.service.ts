import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { ListResponseData } from '../base.dto';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<ListResponseData<User>> {
    const skip = (page - 1) * size;
    const take = size;
    const total = await this.userRepository.count();
    const data = await this.userRepository.find({ skip, take });
    return {
      page,
      size,
      total,
      data,
      message: 'Users fetched successfully',
    };
  }
}
