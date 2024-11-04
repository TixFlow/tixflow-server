import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { ListResponseData } from "../base.dto";
import { User } from "src/entities";

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController{
    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    async getAllUsers(
        @Query('page') page: number = 1,
        @Query('size') size: number = 10
    ) : Promise<ListResponseData<User>>{
        return await this.userService.getAllUsers({ page, size });
    }
}