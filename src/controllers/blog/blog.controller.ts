import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  BadRequestException,
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
import { User, UserRole } from 'src/entities/user.entity';
import { UserId } from 'src/decorators/user.decorator';
import { Ticket } from 'src/entities/ticket.entity';
import { UserService } from '../user/user.service';

@ApiTags('Blog')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, enum: Category })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getAllBlogs(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('category') category: Category = null,
    @Query('search') search: string = null,
  ): Promise<ListResponseData<Blog>> {
    return await this.blogService.getAllBlogs({ page, size, category, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog by id' })
  async getBlogById(@Param('id') id: string): Promise<ItemResponseData<Blog>> {
    if(!id){
      throw new BadRequestException('Id is required');
    }
    return await this.blogService.getBlogById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a blog' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.Admin, UserRole.Staff)
  async createBlog(
    @UserId() userId: string,
    @Body() blog: CreateBlogRequestBody,
  ): Promise<ItemResponseData<Blog>> {
    return await this.blogService.createBlog(userId, blog);
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
    const user = await this.userService.getUserById(userId);
    return await this.blogService.updateBlog(user, id, blog);
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
    const user = await this.userService.getUserById(userId);
    return await this.blogService.deleteBlog(user, id);
  }

  @Get(':id/tickets')
  @ApiOperation({ summary: 'Get all tickets of a blog' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  async getTicketsByBlogId(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Param('id') id: string,
  ): Promise<ListResponseData<Ticket>> {
    return await this.blogService.getTicketsByBlogId(page, size, id);
  }
}
