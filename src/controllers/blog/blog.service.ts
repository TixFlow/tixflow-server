import { InjectRepository } from '@nestjs/typeorm';
import { Blog, Category } from 'src/entities/blog.entity';
import { Repository } from 'typeorm';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateBlogRequestBody } from './blog.dto';

export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async getBlogById(id: string): Promise<ItemResponseData<Blog>>{
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog){
      throw new NotFoundException('Blog not found');
    }
    return {
      data: blog,
      message: 'Blog fetched successfully'
    };
  }

  async getAllBlogs({
    page,
    size,
    category
  }: {
    page: number;
    size: number;
    category?: Category;
  }): Promise<ListResponseData<Blog>>{
    const skip = (page - 1) * size;
    const take = size;
    const total = await this.blogRepository.count();
    const data = await this.blogRepository.find({
        where: category ? { category } : {},
        skip,
        take,
        order: { createdAt: 'DESC' }
    });
    return {
        page,
        size,
        total,
        data,
        message: 'Blogs fetched successfully'
    };
  }

  async createBlog(blog : CreateBlogRequestBody) : Promise<ItemResponseData<Blog>>{
    const newBlog = await this.blogRepository.create(blog);
    return{
        data: await this.blogRepository.save(newBlog),
        message: 'Blog created successfully'
    }
  }
}
