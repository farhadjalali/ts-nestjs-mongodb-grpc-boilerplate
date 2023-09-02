import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**
 * City Weather DTO Class
 */
export class CityWeatherDto {
  /**
   * id field
   */
  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: number;
}
