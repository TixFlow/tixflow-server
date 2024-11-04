import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Blog } from "./blog.entity";
import { Ticket } from "./ticket.entity";

@Entity('categories')
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type: 'varchar', length: 50})
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Blog, blog => blog.category)
    blogs : Array<Blog>

    @OneToMany(() => Ticket, ticket => ticket.category)
    tickets: Array<Ticket>
}