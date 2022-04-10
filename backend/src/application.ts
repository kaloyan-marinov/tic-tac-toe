import Koa from "koa";
import Router from "koa-router";

const app = new Koa();

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = { msg: "Hello World!" };
});

app.use(router.allowedMethods());
app.use(router.routes());

export { app };
