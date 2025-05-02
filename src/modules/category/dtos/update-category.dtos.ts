import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    name: string;
  
    @IsInt()
    @IsOptional()
    category_id: number;
  }
  