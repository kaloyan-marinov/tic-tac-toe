import Koa from "koa";
import logger from "koa-logger";

import { router } from "./router";

const app = new Koa();

app.use(logger());

app.use(router.allowedMethods());
app.use(router.routes());

export { app };
