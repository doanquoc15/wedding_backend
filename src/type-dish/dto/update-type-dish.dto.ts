import { PartialType } from '@nestjs/swagger';
import { CreateTypeDishDto } from './create-type-dish.dto';

export class UpdateTypeDishDto extends PartialType(CreateTypeDishDto) {}
