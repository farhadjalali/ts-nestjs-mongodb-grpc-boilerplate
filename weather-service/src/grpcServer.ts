import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { CityService } from "./city/city.service";
import { config } from "./config";
import { logger } from "./utils";

/**
 * Starts the GRPC server
 */
export function startGrpcServer() {
  try {
    const server = getServer();
    logger.debug("Server starting...");
    server.bindAsync(
      `0.0.0.0:${config.port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error("startGrpcServer failed:", err);
          process.exit(1);
        }

        server.start();
        logger.info(`Server running on port ${port}`);
      },
    );
  } catch (err) {
    logger.error("Error in startServer.", err);
    process.exit(1);
  }
}

function getServer() {
  const PROTO_PATH = "../proto/weather.proto";

  const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const weatherProto: any =
    grpc.loadPackageDefinition(packageDef).WeatherService;

  const server = new grpc.Server();

  server.addService(weatherProto.service, CityService);

  return server;
}
