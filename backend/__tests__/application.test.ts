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

test("GET /api/health-check", async () => {
  const response = await request(server).get("/api/health-check");

  expect(response.status).toEqual(200);
  expect(response.type).toEqual("application/json");
  expect(response.body).toEqual({
    "health-check": "passed",
  });
});

describe("POST /api/users", () => {
  test("should return 400", async () => {
    const response = await request(server).post("/api/users");

    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      error: "The body of your request has to specify a value for 'username'",
    });
  });

  test("should return 200", async () => {
    const response = await request(server).post("/api/users").send({
      username: "John Doe",
    });

    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      msg: "Hello, John Doe!",
    });
  });
});
