import { IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumberString()
    @IsNotEmpty()
    @IsOptional()
    price: number;

    @IsNumberString()
    @IsNotEmpty()
    @IsOptional()
    category_id: number;

}