import { Weather } from "../weather/weather.model";
import { City } from "../city/city.model";
import { getWeather } from "./openWeather";

export async function fetchOrAskAllCitiesWeather() {
  const cities = await City.find().exec();
  const weatherPromises = cities.map((city) =>
    fetchOrAskWeather(city.name, city.id),
  );
  return await Promise.all(weatherPromises);
}

export async function fetchOrAskWeather(name: string, id?: number) {
  let weather = await Weather.findOne({ name, id }).exec();
  if (!weather) {
    weather = await getWeather(name);

    // Save weather data to DB for future use
    await Weather.create(weather);
  }
  return weather;
}
