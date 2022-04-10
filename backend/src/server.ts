import http from "http";

import { PORT } from "./constants";
import { app } from "./application";

const server: http.Server = http.createServer(app.callback());

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} ...`);
});
