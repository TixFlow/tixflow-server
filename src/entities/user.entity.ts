import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { Exclude } from "class-transformer";

export enum UserRole{
    Admin = 'admin',
    Staff = 'staff',
    User = 'user'
}

export enum UserGender{
    Male = 'male',
    Female = 'female',
    Undefined = 'undefined'
}

export enum UserStatus{
    Unverified = 'unverified',
    Verified = 'verified',
    Removed = 'removed',
    Restricted = 'restricted',
    Banned = 'banned'
}

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50})
    email: string;

    @Column({type: 'varchar', length: 50})
    firstName: string;

    @Column({type: 'varchar', length: 50})
    lastName: string;

    @Column({
        type: 'enum', 
        enum: UserRole, 
        default: UserRole.User
    })
    role: UserRole;

    @Column({type: 'varchar', length: 50, default: null})
    avatarUrl: string;

    @Column({type: 'varchar', length: 255})
    @Exclude()
    password: string;

    @Column({type: 'varchar', length: 50})
    phoneNumber: string;

    @Column({
        type: 'enum', 
        enum: UserGender, 
        default: UserGender.Undefined
    })
    gender: UserGender;

    @Column({
        type: 'enum', 
        enum: UserStatus, 
        default: UserStatus.Unverified
    })
    status: UserStatus;

    @Column({type: 'varchar', length: 50, default: null})
    verificationCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @OneToMany(() => Ticket, ticket => ticket.user)
    tickets: Array<Ticket>
}