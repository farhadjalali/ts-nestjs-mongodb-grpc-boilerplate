import { startGrpcServer } from "./grpcServer";
import * as mongoose from "mongoose";
import { config } from "./config";
import { logger } from "./utils";

process.on("uncaughtException", (err) => {
  logger.error("There was an uncaught exception:", err);
  process.exit(1);
});

mongoose
  .connect(config.mongoose.url)
  .then(() => {
    logger.debug("Database connection successful.");
    startGrpcServer();
  })
  .catch((err) => {
    logger.error(
      "MongoDB connection error. Please make sure MongoDB is running. " + err,
    );
    process.exit(1);
  });
