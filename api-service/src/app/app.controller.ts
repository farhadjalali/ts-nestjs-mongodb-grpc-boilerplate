import { Controller, Get } from "@nestjs/common";
const packageJson = require("../../package.json");

/**
 * App Controller
 */
@Controller()
export class AppController {
  /**
   * @returns {Object} - Returns the version of the api-service
   */
  @Get("version")
  async getServiceVersion() {
    return { version: packageJson.version };
  }
}
