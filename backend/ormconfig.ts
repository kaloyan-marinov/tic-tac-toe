import { config } from "dotenv";
import path from "path";

import { ConnectionOptions } from "typeorm";

import { Game, User } from "./src/entities";

config();

const { DATABASE_URL } = process.env;
if (DATABASE_URL === undefined) {
  console.log(
    `${new Date().toISOString()} -` +
      ` ${__filename} -` +
      ` no environment variable DATABASE_URL has been found - aborting!`
  );
  process.exit(1);
}

const connectionsOptions: ConnectionOptions[] = [
  {
    name: "connection-to-db-for-dev",
    type: "sqlite",
    database: DATABASE_URL,
    // entities: [path.join(__dirname), "src", "entities.ts"],
    entities: [User, Game],
    cli: {
      migrationsDir: "./src/migration",
    },
    migrations: ["./src/migration/*.ts"],
  },
  {
    name: "connection-to-db-for-testing",
    type: "sqlite",
    database: ":memory:",
    entities: [path.join(__dirname, "src", "entities.*")],
  },
];

export default connectionsOptions;
