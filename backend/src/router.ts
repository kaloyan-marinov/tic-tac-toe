import Router from "koa-router";
import { getConnection, Repository } from "typeorm";
import { connectionName, INITIAL_STATE_FOR_GAME } from "./constants";
import { Game, User } from "./entities";
import { usernameAuth } from "./middleware";
import { validateCoordinate } from "./utilities";

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

router.post("/api/games", usernameAuth, async (ctx) => {
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

router.put("/api/games", usernameAuth, async (ctx) => {
  const gamesRepository: Repository<Game> =
    getConnection(connectionName).getRepository(Game);

  let g: Game | undefined = await gamesRepository.findOne();
  if (g === undefined) {
    ctx.status = 400;
    ctx.body = {
      error: "You aren't currently playing a game",
    };
    return;
  }

  if (!ctx.request.body.hasOwnProperty("x") || !ctx.request.body.hasOwnProperty("y")) {
    ctx.status = 400;
    ctx.body = {
      error: "The body of your request has to specify values for 'x' and 'y'",
    };
    return;
  }

  const { x, y } = ctx.request.body;

  if (!validateCoordinate(x) || !validateCoordinate(y)) {
    ctx.status = 400;
    ctx.body = {
      error: "Each of 'x' and 'y' has to be set equal to 0, 1, or 2",
    };
    return;
  }

  const gameState = JSON.parse(g.state as string); // TODO: fix the entity!
  gameState[x][y] = {
    turn: 0,
    username: ctx.username,
  };
  g.state = JSON.stringify(gameState);
  await gamesRepository.save(g);

  ctx.body = {
    id: g.id,
    state: JSON.parse(g.state),
  };
});

export { router };
