import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

/**
 * The url endpoint for open api ui
 * @type {string}
 */
export const SWAGGER_API_ROOT: string = "api/docs";
/**
 * The name of the api
 * @type {string}
 */
export const SWAGGER_API_NAME: string = "Weather API";
/**
 * A short description of the api
 * @type {string}
 */
export const SWAGGER_API_DESCRIPTION: string =
  "A simple API to fetch weather information.";
/**
 * Current version of the api
 * @type {string}
 */
export const SWAGGER_API_CURRENT_VERSION: string = "1.0";

const options = new DocumentBuilder()
  .setTitle(SWAGGER_API_NAME)
  .setDescription(SWAGGER_API_DESCRIPTION)
  .setVersion(SWAGGER_API_CURRENT_VERSION)
  .build();

export const setupSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
};
