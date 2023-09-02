import Joi from "joi";
import "dotenv/config";
import * as grpc from "@grpc/grpc-js";
import path from "path";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    LOG_PORT: Joi.number().default(3009),
    WEATHER_SERVICE_ENDPOINT: Joi.string()
      .regex(/.+:\d+/)
      .required(),
    UPDATE_WEATHER_DATA_INTERVAL: Joi.string().required(),
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
  updateWeatherInterval: envVars.UPDATE_WEATHER_DATA_INTERVAL,

  log: {
    infoFile: path.join(logPath, "api-info.log"),
    errorFile: path.join(logPath, "api-error.log"),
    colorizeConsoleLogs: true,
    maxSize: 1000000,
    httpPort: envVars.LOG_PORT,
  },

  weatherService: {
    endpoint: envVars.WEATHER_SERVICE_ENDPOINT,
    serviceConfig: {
      methodConfig: [
        {
          name: [{ service: "WeatherService" }],
          waitForReady: true,
          retryPolicy: {
            maxAttempts: 20,
            initialBackoff: "1s",
            maxBackoff: "15s",
            backoffMultiplier: 2,
            retryableStatusCodes: [grpc.status.UNAVAILABLE],
          },
        },
      ],
    },
  },
};
