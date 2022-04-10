import Router from "koa-router";

const router = new Router();

router.get("/api/health-check", (ctx) => {
  ctx.body = { "health-check": "passed" };
});

router.post("/api/users", (ctx) => {
  if (!ctx.request.body.hasOwnProperty("username")) {
    ctx.status = 400;
    ctx.body = {
      error: "The body of your request has to specify a value for 'username'",
    };
    return;
  }

  const { username } = ctx.request.body;
  ctx.body = {
    msg: `Hello, ${username}!`,
  };
});

export { router };
