import { IsNotEmpty, IsString } from "class-validator";

export class CreateTypeDishDto {
    @IsString()
    @IsNotEmpty()
    typeName: string;
}
