import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { CategoryService } from './category.service';
  import { CreateCategoryDto } from './dtos/create-category.dtos';
  import { UpdateCategoryDto } from './dtos/update-category.dtos';
import { GetAllCategoryDto } from './dtos/get-all-category.dtos';  
import { ParseIntCustomPipe } from '../pipes/parse-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckFileSizePipe } from '../pipes/check-file-size.pipe';
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
    @UseInterceptors(FileInterceptor('image'))
    async createCategory(@Body() body: CreateCategoryDto,@UploadedFile(new CheckFileSizePipe(2 * 1024 * 1024)) image:Express.Multer.File) {
      return await this.categoryService.createCategory(body,image);
    }
  
    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntCustomPipe) id: number) {
      return await this.categoryService.deleteCategory(id);
    }
  
    @Put(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateCategory(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: UpdateCategoryDto,
      @UploadedFile(new CheckFileSizePipe(2 * 1024 * 1024)) image: Express.Multer.File
    ) {
      return await this.categoryService.updateCategory(id, data, image);
    }
  }
  