import { PartialType } from '@nestjs/swagger';
import { CreateCustomizedComboDto } from './create-customized-combo.dto';

export class UpdateCustomizedComboDto extends PartialType(CreateCustomizedComboDto) {}
