import { NestFactory } from "@nestjs/core";
import headers from "helmet";
import rateLimiter from "express-rate-limit";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./app/AllExceptionsFilter";
import { logger, setupSwagger } from "./utils";
import { config } from "./config";

(async () => {
  process.on("uncaughtException", (err) => {
    logger.error("There was an uncaught exception:", err);
    process.exit(1);
  });

  const app = await NestFactory.create(AppModule, {
    logger: console, // todo: replace with winston logger
  });

  setupSwagger(app);
  app.enableCors();
  app.use(headers());
  app.use(
    rateLimiter({
      windowMs: 60, // 1 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(config.port, "0.0.0.0");
  logger.info(`Application is running on: ${await app.getUrl()}`);
})();
