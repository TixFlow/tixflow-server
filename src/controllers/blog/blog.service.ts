import { InjectRepository } from '@nestjs/typeorm';
import { Blog, BlogStatus, Category } from 'src/entities/blog.entity';
import { Like, Repository } from 'typeorm';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBlogRequestBody, UpdateBlogRequestBody } from './blog.dto';
import { User, UserRole } from 'src/entities/user.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { contains } from 'class-validator';

export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async getBlogById(id: string): Promise<ItemResponseData<Blog>> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return {
      data: blog,
      message: 'Blog fetched successfully',
    };
  }

  async getAllBlogs({
    page,
    size,
    category,
    search,
  }: {
    page: number;
    size: number;
    category?: Category;
    search?: string;
  }): Promise<ListResponseData<Blog>> {
    const total = await this.blogRepository.count({
      where: {
      category,
      title: search ? Like(`%${search}%`) : undefined,
      },
    });
    const totalPage = Math.ceil(total / size);
    const data = await this.blogRepository.find({
      where: {
        category,
        title: search ? Like(`%${search}%`) : undefined,
        },
      skip: (page - 1) * size,
      take: size,
    });
    return {
      page,
      size,
      total,
      totalPage,
      data,
      message: 'Blogs fetched successfully',
    };
  }

  async createBlog(
    userId: string,
    blog: CreateBlogRequestBody,
  ): Promise<ItemResponseData<Blog>> {
    const newBlog = await this.blogRepository.save({...blog, userId});
    return {
      data: newBlog,
      message: 'Blog created successfully',
    };
  }

  async updateBlog(
    userId: string,
    id: string,
    blog: UpdateBlogRequestBody,
  ): Promise<ItemResponseData<Blog>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const found = await this.blogRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException('Blog not found');
    }
    if (
      user.role !== UserRole.Admin &&
      user.role !== UserRole.Moderator &&
      user.id !== found.userId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to update this blog',
      );
    }

    const updateB = {
      ...found,
      title: blog.title || found.title,
      content: blog.content || found.content,
      imageUrl: blog.imageUrl || found.imageUrl,
      category: blog.category || found.category,
    };
    await this.blogRepository.update(id, { ...updateB, updatedAt: new Date() });
    const updatedBlog = await this.blogRepository.findOne({ where: { id } });
    return {
      data: updatedBlog,
      message: 'Blog updated successfully',
    };
  }

  async deleteBlog(
    userId: string,
    id: string,
  ): Promise<ItemResponseData<Blog>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const found = await this.blogRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException('Blog not found');
    }
    if (
      user.role !== UserRole.Admin &&
      user.role !== UserRole.Moderator &&
      user.id !== found.userId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to delete this blog',
      );
    }
    await this.blogRepository.update(id, { status: BlogStatus.Removed });
    return {
      data: found,
      message: 'Blog deleted successfully',
    };
  }

  async getTicketsByBlogId(
    page: number,
    size: number,
    id: string,
  ): Promise<ListResponseData<Ticket>> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    const total = await this.ticketRepository.count({ where: { blogId: id } });
    const data = await this.ticketRepository.find({
      where: { blogId: id },
      skip: (page - 1) * size,
      take: size,
    });
    const totalPage = Math.ceil(total / size);
    return {
      page,
      size,
      total,
      totalPage,
      data,
      message: 'Tickets fetched successfully',
    };
  }
}
