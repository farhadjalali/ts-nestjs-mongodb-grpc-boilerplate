import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**
 * City Create DTO Class
 */
export class CreateCityDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;
}
