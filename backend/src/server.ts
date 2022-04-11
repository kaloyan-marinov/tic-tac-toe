import http from "http";

import { connectionName, PORT } from "./constants";
import { app } from "./application";
import { Connection, createConnection } from "typeorm";

const server: http.Server = http.createServer(app.callback());

const dbConnectionPromise: Promise<Connection> = createConnection(connectionName);

dbConnectionPromise
  .then((connection: Connection) => {
    console.log(
      `Establishing a connection (named ${connection.name}) to the DB - successful.`
    );

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} ...`);
    });
  })
  .catch((err) => console.error(err));
