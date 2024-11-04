import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserStatus } from "src/entities";
import { Repository } from "typeorm";
import { SignInRequestBody, SignInResponseData, SignUpRequestBody, SignUpResponseData, VerifiedResponseData } from "./auth.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async signIn({email, password} : SignInRequestBody) : Promise<SignInResponseData>{
        const user = await this.userRepository.findOneBy({email});
        if(!user){
            throw new NotFoundException('User not found');
        }
        if(user.status === UserStatus.Removed || user.status === UserStatus.Banned){
            throw new BadRequestException('User is not allowed to login');
        }
        if (!await bcrypt.compare(password, user.password)){
            throw new BadRequestException('Wrong creadentials');
        }
        const payload = {
            ...user,
            password: undefined
        }
        const accessToken = await this.jwtService.signAsync(payload,{
            secret: process.env.JWT_SECRET
        });
        return {
            token: accessToken
        };
    }

    async signUp(requestBody: SignUpRequestBody): Promise<SignUpResponseData>{
        const user = await this.userRepository.findOneBy({email: requestBody.email});
        console.log('user:', user);
        if (user){
            throw new BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(requestBody.password, 10);
        requestBody.password = hashedPassword;
        await this.userRepository.save(requestBody);
        return {
            message: 'User created successfully'
        };
    }

    async validate(userId: string): Promise<VerifiedResponseData>{
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user){
            throw new NotFoundException('User not found');
        }
        return {
            user
        };
    }
}