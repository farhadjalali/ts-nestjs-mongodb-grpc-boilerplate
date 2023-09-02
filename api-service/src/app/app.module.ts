import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CityModule } from "../city/city.module";
import { ScheduleModule } from "@nestjs/schedule";
import { LogMiddleware } from "../utils";
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

@Module({
  imports: [ScheduleModule.forRoot(), CityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes("*"); // Apply for all routes
  }
}
