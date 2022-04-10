import Router from "koa-router";

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = { msg: "Hello World!" };
});

router.post("/", (ctx) => {
  if (!ctx.request.body.hasOwnProperty("name")) {
    ctx.status = 400;
    ctx.body = {
      error: "The body of your request has to specify a value for 'name'",
    };
    return;
  }

  const { name } = ctx.request.body;
  ctx.body = {
    msg: `Hello, ${name}!`,
  };
});

export { router };
