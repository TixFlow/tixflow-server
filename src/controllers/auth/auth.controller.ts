import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInRequestBody, SignUpRequestBody } from "./auth.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { UserId } from "src/decorators/user.decorator";

@ApiTags('Auth')
@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('signin')
    async signIn(@Body() body: SignInRequestBody){
        return await this.authService.signIn(body);
    }

    @Post('signup')
    async signUp(@Body() body: SignUpRequestBody){
        return await this.authService.signUp(body);
    }

    @ApiBearerAuth()
    @Get('verify')
    @UseGuards(AuthGuard)
    async verified(@UserId() UserId: string){
        return await this.authService.validate(UserId);
    }
}