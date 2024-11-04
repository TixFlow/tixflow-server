import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [AuthController],
    providers: [
        JwtService,
        AuthService,
    ]
})
export class AuthModule {
}