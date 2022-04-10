import Router from "koa-router";
import { getConnection, Repository } from "typeorm";
import { connectionName, INITIAL_STATE_FOR_GAME } from "./constants";
import { Game, User } from "./entities";

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

  // TEMPORARILY AND FOR THE SAKE OF SIMPLICITY: allow only 2 clients.
  const users: User[] = await usersRepository.find();
  if (users.length === 2) {
    ctx.status = 400;
    ctx.body = {
      msg: "TEMPORARILY AND FOR THE SAKE OF SIMPLICITY: allow only 2 clients.",
    };
    return;
  }

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

router.post("/api/games", async (ctx) => {
  const gamesRepository: Repository<Game> =
    getConnection(connectionName).getRepository(Game);

  let g: Game = new Game();
  g.state = JSON.stringify(INITIAL_STATE_FOR_GAME);
  await gamesRepository.save(g);

  ctx.status = 201;
  ctx.set("Location", `/api/games/` + g.id);
  ctx.body = {
    id: g.id,
    state: JSON.parse(g.state),
  };
});

export { router };
