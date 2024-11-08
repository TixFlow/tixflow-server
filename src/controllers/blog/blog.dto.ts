import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Category } from "src/entities/blog.entity";

export class CreateBlogRequestBody{
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    imageUrl: string;

    @ApiProperty({enum: Category, enumName: 'Category'})
    @IsNotEmpty()
    category: Category;
}

export class UpdateBlogRequestBody{
    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    imageUrl: string;

    @ApiProperty({enum: Category, enumName: 'Category'})
    category: Category;
}