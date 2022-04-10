import http from "http";

import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../src/application";
import {
  connectionName,
  INITIAL_STATE_FOR_GAME,
  PORT_FOR_TESTING,
} from "../src/constants";

let connection: Connection;
let server: http.Server;

beforeEach(async () => {
  const dbConnectionPromise: Promise<Connection> = createConnection(connectionName);
  connection = await dbConnectionPromise;
  console.log(
    `Establishing a connection (named ${connection.name}) to the DB - successful.`
  );

  try {
    const dropBeforeSync = true;
    await connection.synchronize(dropBeforeSync);
    console.log("Synchronizing the DB schema - successful.");
  } catch (err) {
    console.error("Synchronizing the DB schema - failed.");
    console.error(err);
    throw err;
  }

  server = http.createServer(app.callback());
  server.listen(PORT_FOR_TESTING, () => {
    console.log(`Server listening on port ${PORT_FOR_TESTING} ...`);
  });
});

afterEach(async () => {
  server.close();
  await connection.close();
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
  test("if no 'username' is provided, should return 400", async () => {
    const response = await request(server).post("/api/users");

    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      error: "The body of your request has to specify a value for 'username'",
    });
  });

  test("if a taken 'username' is provided, should return 400", async () => {
    const response1 = await request(server).post("/api/users").send({
      username: "John Doe",
    });

    const response2 = await request(server).post("/api/users").send({
      username: "John Doe",
    });
    expect(response2.status).toEqual(400);
    expect(response2.type).toEqual("application/json");
    expect(response2.body).toEqual({
      error: "Username is taken",
    });
  });

  test("if a valid 'username' is provided, should return 201", async () => {
    const response = await request(server).post("/api/users").send({
      username: "John Doe",
    });

    expect(response.status).toEqual(201);
    expect(response.headers.location).toEqual("/api/users/1");
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      id: 1,
    });
  });
});

describe("POST /api/games", () => {
  test("if no 'username' is provided, should return 401", async () => {
    const response = await request(server).post("/api/games");

    expect(response.status).toEqual(401);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({
      error: "authentication required - via Bearer token",
    });
  });

  test("if a valid 'username' is provided, should return 201", async () => {
    const response1 = await request(server).post("/api/users").send({
      username: "john-doe",
    });

    const response2 = await request(server)
      .post("/api/games")
      .set("Authorization", "Bearer " + "john-doe");

    expect(response2.status).toEqual(201);
    expect(response2.type).toEqual("application/json");
    expect(response2.body).toEqual({
      id: 1,
      state: INITIAL_STATE_FOR_GAME,
    });
  });
});

describe("GET /api/games", () => {
  test("should return 200", async () => {
    const response1 = await request(server).post("/api/users").send({
      username: "john-doe",
    });

    const response2 = await request(server)
      .post("/api/games")
      .set("Authorization", "Bearer " + "john-doe");

    const response3 = await request(server)
      .get("/api/games")
      .set("Authorization", "Bearer " + "john-doe");

    expect(response3.status).toEqual(200);
    expect(response3.type).toEqual("application/json");
    expect(response3.body).toEqual({
      winner: null,
      id: 1,
      state: INITIAL_STATE_FOR_GAME,
    });
  });
});
