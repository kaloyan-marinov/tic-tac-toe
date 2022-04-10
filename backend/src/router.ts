import Router from "koa-router";
import { getConnection, Repository } from "typeorm";
import { connectionName } from "./constants";
import { User } from "./entities";

const router = new Router();

router.get("/api/health-check", (ctx) => {
  ctx.body = { "health-check": "passed" };
});

router.post("/api/users", async (ctx) => {
  if (!ctx.request.body.hasOwnProperty("username")) {
    ctx.status = 400;
    ctx.body = {
      error: "The body of your request has to specify a value for 'username'",
    };
    return;
  }

  const { username } = ctx.request.body;

  const usersRepository: Repository<User> =
    getConnection(connectionName).getRepository(User);

  let duplicateUser: User | undefined;
  duplicateUser = await usersRepository.findOne({ username });
  if (duplicateUser !== undefined) {
    ctx.status = 400;
    ctx.body = {
      error: "Username is taken",
    };
    return;
  }

  let u: User = new User();
  u.username = username;
  await usersRepository.save(u);

  ctx.status = 201;
  ctx.set("Location", "/api/users/" + u.id);
  ctx.body = {
    id: u.id,
  };
});

export { router };
