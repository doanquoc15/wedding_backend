import { Module } from '@nestjs/common';
import { TypeDishService } from './type-dish.service';
import { TypeDishController } from './type-dish.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [TypeDishController],
  providers: [TypeDishService],
})
export class TypeDishModule {}
