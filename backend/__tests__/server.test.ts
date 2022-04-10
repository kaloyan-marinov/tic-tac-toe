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
