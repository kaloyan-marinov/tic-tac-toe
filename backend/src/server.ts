import Koa from "koa";
import Router from "koa-router";

const app = new Koa();

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = { msg: "Hello World!" };
});

app.use(router.allowedMethods());

app.use(router.routes());

app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
