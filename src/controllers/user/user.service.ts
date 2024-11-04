import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { CreateUserRequestBody } from './user.dto';
import * as bcrypt from 'bcrypt';

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

  async createUser(user: CreateUserRequestBody) : Promise<ItemResponseData<User>>{
    const found = await this.userRepository.findOne({ where: { email: user.email } });
    if(found){
      throw new BadRequestException('User already exists');
    }
    user.password = await bcrypt.hash(user.password, 10);
    const newUser : User = await this.userRepository.save(user);
    return {
      data: {
        ...newUser,
        password: undefined
      },
      message: 'User created successfully'
    }
  }
}
