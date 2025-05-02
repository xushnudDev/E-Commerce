import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    name?: string;

    @IsInt()
    price?: number;

    @IsOptional()
    category_id?: number;
}