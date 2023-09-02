import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app/app.module";
import { ValidationPipe } from "@nestjs/common";

describe("AppController (e2e)", () => {
  let app;
  let createdCity;
  const cityName = "Tokyo";

  beforeEach(async () => {
    // TODO: add the logic to use .env.test and clear the database here
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it("/version (GET) get api version", () => {
    return request(app.getHttpServer())
      .get("/version")
      .expect(200)
      .then((res) => {
        expect(res.body.version).toMatch(/\d+\.\d+\.\d+/);
      });
  });

  it("/cities exists and return an array", () => {
    return request(app.getHttpServer())
      .get("/cities")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it("/cities (POST) created the city", () => {
    return request(app.getHttpServer()).post("/cities").send({
      name: cityName,
    });
  });

  it("/cities (POST) try to re-creation of the city failed.", () => {
    return request(app.getHttpServer())
      .post("/cities")
      .send({
        name: cityName,
      })
      .expect(409);
  });

  it("/cities exists and return the created city", () => {
    return request(app.getHttpServer())
      .get("/cities")
      .expect(200)
      .then((res) => {
        createdCity = res.body[0];
        expect(createdCity.name).toBe(cityName.toLowerCase());
      });
  });

  it("/cities/:id (DELETE) deleted the city", () => {
    return request(app.getHttpServer())
      .delete(`/cities/${createdCity.id}`)
      .expect(200);
  });

  it("/cities/:id (DELETE) trying to deleting the city failed", () => {
    return request(app.getHttpServer())
      .delete(`/cities/${createdCity.id}`)
      .expect(409);
  });

  afterAll(async () => {
    await app.close();
  });
});
