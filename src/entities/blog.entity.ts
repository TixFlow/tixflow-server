import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Ticket } from "./ticket.entity";

export enum BlogStatus{
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
    Removed = 'removed'
}
@Entity('blogs')
export class Blog{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar', 
        length: 50,
        unique: true,
        nullable: false
    }) 
    title: string;
    
    @Column({type: 'text'})
    content: string;

    @Column({type: 'varchar', length: 50})
    imageUrl: string;

    @Column({type: 'uuid', length: 36, default: null})
    categoryId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Category, category => category.blogs)
    @JoinColumn({name: 'categoryId'})
    category: Category;

    @OneToMany(() => Ticket, ticket => ticket.blog)
    tickets: Array<Ticket>;
}