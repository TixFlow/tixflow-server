import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBlogRequestBody } from './blog.dto';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { Blog, Category } from 'src/entities/blog.entity';

@ApiTags('Blog')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, enum: Category })
  async getAllBlogs(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('category') category: Category = null,
  ): Promise<ListResponseData<Blog>> {
    return await this.blogService.getAllBlogs({ page, size , category});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog by id' })
  async getBlogById(id: string) : Promise<ItemResponseData<Blog>>{
    return await this.blogService.getBlogById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a blog' })
  async createBlog(@Body() blog: CreateBlogRequestBody) : Promise<ItemResponseData<Blog>>{
    return await this.blogService.createBlog(blog);
  }
}
