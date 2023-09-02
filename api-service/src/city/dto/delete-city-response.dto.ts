import { ApiProperty } from "@nestjs/swagger";

/**
 * Delete City Response DTO
 */
export class DeleteCityResponseDto {
  @ApiProperty()
  message: string;
}
