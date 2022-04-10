import Router from "koa-router";

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = { msg: "Hello World!" };
});

export { router };
