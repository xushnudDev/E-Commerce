import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
  } from '@nestjs/common';
  import { CategoryService } from './category.service';
  import { CreateCategoryDto } from './dtos/create-category.dtos';
  import { UpdateCategoryDto } from './dtos/update-category.dtos';
import { GetAllCategoryDto } from './dtos/get-all-category.dtos';  
import { ParseIntCustomPipe } from '../pipes/parse-int.pipe';
  @Controller('categories')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Get()
    async getCategories(@Query() queries: GetAllCategoryDto) {
      return await this.categoryService.getAllCategories(queries);
    }
  
    @Get(':id')
    async getCategory(@Param('id') id: number | string) {
      return await this.categoryService.getCategoryById(id);
    }
  
    @Post()
    async createCategory(@Body() body: CreateCategoryDto) {
      return await this.categoryService.createCategory(body);
    }
  
    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntCustomPipe) id: number) {
      return await this.categoryService.deleteCategory(id);
    }
  
    @Put(':id')
    async updateCategory(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: UpdateCategoryDto,
    ) {
      return await this.categoryService.updateCategory(id, data);
    }
  }
  