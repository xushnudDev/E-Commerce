import { IsInt, IsNumberString, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MinLength(4)
    name: string;

    @IsOptional()
    @IsNumberString()
    category_id?: number;
}