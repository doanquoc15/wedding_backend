import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateZoneDto {
    @IsString()
    @IsNotEmpty()
    zoneName : string;
    
    @IsNumber()
    @IsNotEmpty()
    numberRoom : number
}
