import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBlogRequestBody, UpdateBlogRequestBody } from './blog.dto';
import { ItemResponseData, ListResponseData } from '../base.dto';
import { Blog, Category } from 'src/entities/blog.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/entities/user.entity';
import { UserId } from 'src/decorators/user.decorator';

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
    return await this.blogService.getAllBlogs({ page, size, category });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog by id' })
  async getBlogById(id: string): Promise<ItemResponseData<Blog>> {
    return await this.blogService.getBlogById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a blog' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.Admin, UserRole.Staff)
  async createBlog(
    @Body() blog: CreateBlogRequestBody,
  ): Promise<ItemResponseData<Blog>> {
    return await this.blogService.createBlog(blog);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.Admin, UserRole.Staff)
  async updateBlog(
    @UserId() userId: string,
    @Body() blog: UpdateBlogRequestBody,
    @Param('id') id: string,
  ): Promise<ItemResponseData<Blog>> {
    return await this.blogService.updateBlog(userId, id, blog);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.Admin, UserRole.Staff)
  async deleteBlog(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<ItemResponseData<Blog>> {
    return await this.blogService.deleteBlog(userId, id);
  }
}
