import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**
 * City DTO
 */
export class CityDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  coord: {
    lat: number;
    lon: number;
  };

  @ApiProperty()
  country: string;

  @ApiProperty()
  population: number;

  @ApiProperty()
  timezone: number;

  @ApiProperty()
  sunrise: number;

  @ApiProperty()
  sunset: number;

  @ApiProperty()
  temperature: number;
}
