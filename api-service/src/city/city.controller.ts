import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  ValidationPipe,
  Param,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { CityService } from "./city.service";
import { CityDto, CreateCityDto, DeleteCityResponseDto } from "./dto";

/**
 * Weather Controller
 */
@Controller("cities")
export class CityController {
  /**
   * Constructor
   * @param {CityService} cityService city service
   */
  constructor(private readonly cityService: CityService) {}

  /**
   * Delete the given city
   * @description Delete the given city
   * @param {number} cityId the city id
   */
  @Delete(":id")
  @ApiResponse({ status: 200, description: "City is deleted successfully." })
  @ApiResponse({ status: 404, description: "City not found" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  async deleteCity(@Param("id") id: number): Promise<DeleteCityResponseDto> {
    return await this.cityService.deleteCity(id);
  }

  /**
   * Return all cities
   * @returns {CityDto[]} the cities
   */
  @Get()
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  async getCities(): Promise<CityDto[]> {
    return await this.cityService.getCities();
  }

  /**
   * Create a new city
   * @param {CreateCityDto} payload the city name
   * @example
   * {
   * "name": "Paris" // city name
   * }
   * @returns {CityDto} the created city
   */
  @Post()
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 409, description: "Conflict" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  async createCity(
    @Body(new ValidationPipe())
    payload: CreateCityDto,
  ): Promise<CityDto> {
    return await this.cityService.createCity(payload);
  }

  /**
   * Get all cities weather
   */
  @Get("weather")
  @ApiResponse({
    status: 200,
    description: "Weather for all cities have been successfully retrieved.",
  })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  async getAllCitiesWeather() {
    return await this.cityService.getAllCitiesWeather();
  }

  /**
   * Get weather of the given city
   * @param {string} name the city name
   */
  @Get(":name/weather")
  @ApiResponse({
    status: 200,
    description: "Weather for the given city has been successfully retrieved.",
  })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  async getCityWeather(@Param("name") name: string) {
    return await this.cityService.getCityWeather(name);
  }
}
