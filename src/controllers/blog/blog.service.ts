import { InjectRepository } from '@nestjs/typeorm';
import { Blog, BlogStatus, Category } from 'src/entities/blog.entity';
import { Repository } from 'typeorm';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBlogRequestBody, UpdateBlogRequestBody } from './blog.dto';
import { User, UserRole } from 'src/entities/user.entity';

export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  }: {
    page: number;
    size: number;
    category?: Category;
  }): Promise<ListResponseData<Blog>> {
    const skip = (page - 1) * size;
    const take = size;
    const total = await this.blogRepository.count();
    const data = await this.blogRepository.find({
      where: category ? { category } : {},
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    return {
      page,
      size,
      total,
      data,
      message: 'Blogs fetched successfully',
    };
  }

  async createBlog(
    blog: CreateBlogRequestBody,
  ): Promise<ItemResponseData<Blog>> {
    const newBlog = await this.blogRepository.save(blog);
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

  async deleteBlog(userId: string, id: string): Promise<ItemResponseData<Blog>> {
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
}
