import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>
    ) {}
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1]; 
    if (!token){
        throw new ForbiddenException('Token not found');
    }
    const payload = await this.jwtService.verifyAsync<User>(token, {
        secret: process.env.JWT_SECRET
    })
    if (!payload){
        throw new ForbiddenException('Invalid token');
    }
    const user = await this.userRepository.findOne({ where: { id: payload.id } });
    if (!user){
        throw new ForbiddenException('User not found');
    }
    request.currentUser = user;
    return true;
  }
}