import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ItemResponseData, ListResponseData } from "../base.dto";
import { User } from "src/entities";
import { CreateUserRequestBody, UpdateUserRequestBody } from "./user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { UserId } from "src/decorators/user.decorator";

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController{
    constructor(
        private readonly userService: UserService
    ){}

    @ApiOperation({ summary: 'Get all users' })
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'size', required: false, type: Number })
    async getAllUsers(
        @Query('page') page: number = 1,
        @Query('size') size: number = 10
    ) : Promise<ListResponseData<User>>{
        return await this.userService.getAllUsers({ page, size });
    }

    @ApiOperation({ summary: 'Create a user' })
    @Post()
    async createUser(@Body() user : CreateUserRequestBody) : Promise<ItemResponseData<User>>{
        return await this.userService.createUser(user);
    }

    @ApiOperation({ summary: 'Get a user by id' })
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<ItemResponseData<User>> {
        const user = await this.userService.getUserById(id);
        return {
            data: user,
            message: 'User fetched successfully'
        }
    }

    @ApiOperation({ summary: 'Update a user' })
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard)
    async updateUser(
        @Param('id') id: string,
        @UserId() userId: string,
        @Body() user: UpdateUserRequestBody
    ) : Promise<ItemResponseData<User>>{
        if (id !== userId) throw new ForbiddenException('You are not allowed to update this user');
        return await this.userService.updateUser(id, user);
    }
}