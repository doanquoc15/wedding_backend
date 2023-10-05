import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TypeDishService } from './type-dish.service';
import { CreateTypeDishDto } from './dto/create-type-dish.dto';
import { UpdateTypeDishDto } from './dto/update-type-dish.dto';

@Controller('type-dish')
export class TypeDishController {
  constructor(private readonly typeDishService: TypeDishService) {}

  @Post()
  create(@Body() createTypeDishDto: CreateTypeDishDto) {
    return this.typeDishService.create(createTypeDishDto);
  }

  @Get()
  findAll( @Query("page") page : string,@Query("itemsPerPage") itemsPerPage: string) {
    return this.typeDishService.findAll(parseInt(page), parseInt(itemsPerPage));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeDishService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeDishDto: UpdateTypeDishDto) {
    return this.typeDishService.update(+id, updateTypeDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeDishService.remove(+id);
  }
}
