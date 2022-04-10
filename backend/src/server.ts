import http from "http";

import { app } from "./application";

const server: http.Server = http.createServer(app.callback());

server.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
