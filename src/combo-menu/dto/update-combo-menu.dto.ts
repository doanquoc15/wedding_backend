import { PartialType } from '@nestjs/swagger';
import { CreateComboMenuDto } from './create-combo-menu.dto';

export class UpdateComboMenuDto extends PartialType(CreateComboMenuDto) {}
