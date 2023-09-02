import { ConflictException, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { WeatherClient, logger } from "../utils";
import { config } from "../config";
import { CityDto, CreateCityDto, DeleteCityResponseDto } from "./dto";
import * as grpc from "@grpc/grpc-js";

@Injectable()
export class CityService {
  @Cron(config.updateWeatherInterval)
  updateWeatherData() {
    // TODO: typed response (DTO) is expected here
    return new Promise((resolve, reject) => {
      WeatherClient.UpdateWeatherData(
        {},
        (error: grpc.ServiceError, response: unknown) => {
          if (!error) {
            resolve(response);
          } else {
            reject(error);
          }
        },
      );
    });
  }

  getAllCitiesWeather() {
    // TODO: typed response (DTO) is expected here
    return new Promise((resolve, reject) => {
      WeatherClient.GetAllCitiesWeather(
        {},
        (error: grpc.ServiceError, response: { weatherList: unknown }) => {
          if (!error) {
            resolve(response.weatherList);
          } else {
            reject(error);
          }
        },
      );
    });
  }

  getCityWeather(cityName: string) {
    // TODO: typed response (DTO) is expected here
    return new Promise((resolve, reject) => {
      WeatherClient.GetCityWeather(
        { name: cityName },
        (error: grpc.ServiceError, response: unknown) => {
          if (!error) {
            resolve(response);
          } else {
            reject(error);
          }
        },
      );
    });
  }

  async getCities() {
    return new Promise<CityDto[]>((resolve, reject) => {
      WeatherClient.GetCities({}, (error: grpc.ServiceError, response: any) => {
        logger.debug("GetCities response: " + JSON.stringify(response));
        if (!error) {
          resolve(response.cities);
        } else {
          reject(error);
        }
      });
    });
  }

  async deleteCity(id: number) {
    return new Promise<DeleteCityResponseDto>((resolve, reject) => {
      WeatherClient.DeleteCity(
        { id },
        (error: grpc.ServiceError, response: { success: boolean }) => {
          if (!error && response.success) {
            resolve({ message: "City deleted successfully!" });
          } else {
            if (error?.code === grpc.status.NOT_FOUND) {
              reject(new ConflictException(`City '${id}' not found.`));
            } else {
              reject(`error deleting city ${id}`);
            }
          }
        },
      );
    });
  }

  async createCity({ name }: CreateCityDto) {
    return new Promise<CityDto>((resolve, reject) => {
      WeatherClient.CreateCity(
        { name },
        (error: grpc.ServiceError, response: unknown) => {
          if (!error) {
            resolve(response as CityDto); // Would be cleaner to use a type guard here (like deleteCity sample above)
          } else {
            logger.error("Create city error:", error);
            if (error.code === grpc.status.ALREADY_EXISTS) {
              reject(new ConflictException(`City ${name} already exists`));
            } else {
              reject(`error creating city ${name}`);
            }
          }
        },
      );
    });
  }
}
