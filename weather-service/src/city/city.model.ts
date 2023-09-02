import { Schema, model } from "mongoose";

/**
 * City entity
 */
export interface ICity {
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
  temperature: number;
}

/**
 * Mongoose City Schema
 */
const citySchema = new Schema({
  name: { type: String, required: true, unique: true },
  id: { type: Number, required: true, unique: true },
  coord: {
    lat: Number,
    lon: Number,
  },
  country: String,
  population: Number,
  timezone: Number,
  sunrise: Number,
  sunset: Number,
  temperature: Number,
});

export const City = model<ICity>("City", citySchema);
