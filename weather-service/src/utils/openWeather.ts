import axios from "axios";
import { config } from "../config";
import assert from "assert";

export const getWeather = async (cityName) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${config.openWeather.apiKey}`;
  const response = await axios.get(url);
  assert(response?.data, "No data received from OpenWeather");
  return response.data;
};
