import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ItemResponseData, ListResponseData } from "../base.dto";
import { User } from "src/entities";
import { CreateUserRequestBody } from "./user.dto";

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
}