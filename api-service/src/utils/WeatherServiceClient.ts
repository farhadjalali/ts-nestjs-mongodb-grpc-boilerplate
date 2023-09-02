import { config } from "../config";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import assert from "assert";
import { logger } from "./logger";

// Setup and expose the Weather gRPC client

const PROTO_PATH = "../proto/weather.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const weatherProto: any =
  grpc.loadPackageDefinition(packageDefinition).WeatherService;
assert(
  weatherProto,
  "weatherProto undefined. Check if the proto file exists and is valid",
);

logger.debug(
  `Creating WeatherServiceClient [${config.weatherService.endpoint}]...`,
);
export const WeatherClient = new weatherProto(
  config.weatherService.endpoint,
  grpc.credentials.createInsecure(),
  {
    "grpc.service_config": JSON.stringify(config.weatherService.serviceConfig),
  },
);
