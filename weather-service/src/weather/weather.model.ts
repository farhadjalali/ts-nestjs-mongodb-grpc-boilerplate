import { Schema, model } from "mongoose";

/**
 * Weather entity
 */
export interface IWeather {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      "3h": number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/**
 * Mongoose Weather Schema
 */
const weatherSchema = new Schema<IWeather>({
  cod: String,
  message: Number,
  cnt: Number,
  list: [
    {
      dt: Number,
      main: {
        temp: Number,
        feels_like: Number,
        temp_min: Number,
        temp_max: Number,
        pressure: Number,
        sea_level: Number,
        grnd_level: Number,
        humidity: Number,
        temp_kf: Number,
      },
      weather: [
        {
          id: Number,
          main: String,
          description: String,
          icon: String,
        },
      ],
      clouds: {
        all: Number,
      },
      wind: {
        speed: Number,
        deg: Number,
        gust: Number,
      },
      visibility: Number,
      pop: Number,
      rain: {
        "1h": Number,
        "3h": Number,
      },
      sys: {
        pod: String,
      },
      dt_txt: String,
    },
  ],
  city: {
    id: Number,
    name: String,
    coord: {
      lat: Number,
      lon: Number,
    },
    country: String,
    population: Number,
    timezone: Number,
    sunrise: Number,
    sunset: Number,
  },
});

export const Weather = model<IWeather>("Weather", weatherSchema);
