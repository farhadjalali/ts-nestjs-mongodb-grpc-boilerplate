import { Weather } from "../weather/weather.model";
import { City } from "../city/city.model";
import * as grpc from "@grpc/grpc-js";
import {
  wrapHandler,
  getWeather,
  fetchOrAskWeather,
  fetchOrAskAllCitiesWeather,
  logger,
} from "../utils";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { ICity } from "./city.model";

export const CityService = {
  /**
   * Returns weather data for all cities
   */
  GetAllCitiesWeather: wrapHandler(
    "GetAllCitiesWeather",
    async (
      _: ServerUnaryCall<unknown, unknown>,
      callback: sendUnaryData<unknown>,
    ) => {
      const weatherList = await fetchOrAskAllCitiesWeather();
      logger.debug("Weather data retrieved for all cities", weatherList);
      callback(null, { weatherList });
    },
  ),

  /**
   * Updates weather data for all cities
   */
  UpdateWeatherData: wrapHandler(
    "UpdateWeatherData",
    async (
      _: ServerUnaryCall<unknown, unknown>,
      callback: sendUnaryData<unknown>,
    ) => {
      const cities = await City.find().exec();
      for (const city of cities) {
        logger.debug("Updating weather data for", city.name);
        const weatherData = await getWeather(city.name);
        logger.debug("Weather data retrieved for", weatherData);
        await Weather.updateOne({ id: city.id }, weatherData, {
          upsert: true,
          new: true,
        }).exec();
      }
      logger.info(`Weather data updated for ${cities.length} cities`);
      callback(null, { success: true, count: cities.length });
    },
  ),

  /**
   * Returns weather data for a city
   */
  GetCityWeather: wrapHandler(
    "GetCityWeather",
    async (
      call: ServerUnaryCall<ICity, unknown>,
      callback: sendUnaryData<unknown>,
    ) => {
      const weather = await fetchOrAskWeather(call.request.name);
      callback(null, weather);
    },
  ),

  /**
   * Returns all cities
   */
  GetCities: wrapHandler(
    "GetCities",
    async (
      _: ServerUnaryCall<unknown, unknown>,
      callback: sendUnaryData<unknown>,
    ) => {
      const cities = await City.find().exec();
      logger.debug("GetCities response: " + JSON.stringify(cities));
      callback(null, { cities });
    },
  ),

  /**
   * Deletes a city
   */
  DeleteCity: wrapHandler(
    "DeleteCity",
    async (
      call: ServerUnaryCall<ICity, unknown>,
      callback: sendUnaryData<unknown>,
    ) => {
      const res = await City.deleteOne({ id: call.request.id });
      if (res.deletedCount === 0)
        callback({
          code: grpc.status.NOT_FOUND,
          message: "City not found",
        });
      callback(null, { success: true });
    },
  ),

  /**
   * Creates a city
   */
  CreateCity: wrapHandler(
    "CreateCity",
    async (
      call: ServerUnaryCall<ICity, unknown>,
      callback: sendUnaryData<unknown>,
    ) => {
      const cityName = call.request.name.toLowerCase(); // save city name in lowercase
      if (await City.exists({ name: cityName })) {
        callback({
          code: grpc.status.ALREADY_EXISTS,
          message: "City already exists",
        });
      } else {
        // get weather data for the city to make sure the city is valid and also to fetch the city id
        const cityWeather = await getWeather(cityName);
        if (!cityWeather) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: "City name is invalid or weather data is not available",
          });
          return;
        }

        const [weather] = cityWeather.list; // pick first weather partition as the city weather
        const temperature = weather.main.temp;
        const createdCity = await City.create({
          ...cityWeather.city,
          name: cityName, // save city name in lowercase
          temperature,
        });
        callback(null, createdCity);
      }
    },
  ),
} as grpc.UntypedServiceImplementation;
