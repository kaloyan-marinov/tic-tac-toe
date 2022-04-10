import http from "http";

import request from "supertest";

import { app } from "../src/application";

let server: http.Server;

beforeEach(() => {
  const port: number = 3001;
  server = http.createServer(app.callback());
  server.listen(port, () => {
    console.log(`Server listening on port ${port} ...`);
  });
});

afterEach(() => {
  server.close();
});

test("GET /", async () => {
  const response = await request(server).get("/");

  expect(response.status).toEqual(200);
  expect(response.type).toEqual("application/json");
  expect(response.body).toEqual({
    msg: "Hello World!",
  });
});

describe("POST /", () => {
  test("should return 400", async () => {
    const response = await request(server).post("/");

    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      error: "The body of your request has to specify a value for 'name'",
    });
  });

  test("should return 200", async () => {
    const response = await request(server).post("/").send({
      name: "John Doe",
    });

    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      msg: "Hello, John Doe!",
    });
  });
});
