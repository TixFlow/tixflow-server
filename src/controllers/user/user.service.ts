import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole, UserStatus } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { CreateUserRequestBody, UpdateUserRequestBody } from './user.dto';
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

  async createUser(
    user: CreateUserRequestBody,
  ): Promise<ItemResponseData<User>> {
    const found = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (found) {
      throw new BadRequestException('User already exists');
    }
    user.password = await bcrypt.hash(user.password, 10);
    const newUser: User = await this.userRepository.save(user);
    return {
      data: {
        ...newUser,
        password: undefined,
        status: UserStatus.Verified,
        role: UserRole.Staff
      },
      message: 'User created successfully',
    };
  }

  async updateUser(
    id: string,
    user: UpdateUserRequestBody,
  ): Promise<ItemResponseData<User>> {
    const found = await this.userRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException('User not found');
    }
    user = {
      ...user,
      firstName: user.firstName || found.firstName,
      lastName: user.lastName || found.lastName,
      phoneNumber: user.phoneNumber || found.phoneNumber,
      password: user.password
        ? await bcrypt.hash(user.password, 10)
        : undefined,
    };
    await this.userRepository.update(id, { ...user, updateAt: new Date() });
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return {
      data: {
        ...updatedUser,
        password: undefined,
      },
      message: 'User updated successfully',
    };
  }

  async deleteUser(id: string): Promise<ItemResponseData<User>> {
    const fonud = await this.userRepository.findOne({ where: { id } });
    if (!fonud) {
      throw new NotFoundException('User not found');
    }
    if (fonud.status === UserStatus.Removed) {
      throw new BadRequestException('User already deleted');
    }
    fonud.status = UserStatus.Removed;
    await this.userRepository.update(id, { ...fonud, updateAt: new Date() });
    const removedUser = await this.userRepository.findOne({ where: { id } });
    return {
      data: {
        ...removedUser,
        password: undefined,
      },
      message: 'User deleted successfully',
    };
  }
}
