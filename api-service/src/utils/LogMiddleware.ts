import { logger } from "../utils";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    logger.debug(`[${req.method}] ${req.originalUrl} (${ip})`);
    next();
  }
}
