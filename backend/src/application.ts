import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";

import { router } from "./router";

const app = new Koa();

app.use(bodyParser());
app.use(logger());

app.use(router.allowedMethods());
app.use(router.routes());

export { app };
