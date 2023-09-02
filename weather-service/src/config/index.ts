import Joi from "joi";
import path from "path";
import "dotenv/config";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().required(),
    LOG_PORT: Joi.number().default(3010),
    DB_URL: Joi.string().required().description("Mongo DB url"),
    OPEN_WEATHER_API_KEY: Joi.string()
      .required()
      .description("Open weather api key"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const logPath = envVars.LOG_PATH || path.join(process.cwd(), "logs");

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.DB_URL,
  },
  openWeather: {
    apiKey: envVars.OPEN_WEATHER_API_KEY,
  },

  log: {
    infoFile: path.join(logPath, "weather-info.log"),
    errorFile: path.join(logPath, "weather-error.log"),
    colorizeConsoleLogs: true,
    maxSize: 1000000,
    httpPort: envVars.LOG_PORT,
  },
};
