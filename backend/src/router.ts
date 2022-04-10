import Koa from "koa";
import Router from "koa-router";
import { getConnection, Repository } from "typeorm";
import { connectionName, INITIAL_STATE_FOR_GAME } from "./constants";
import { Game, User } from "./entities";
import { usernameAuth } from "./middleware";
import { IMove } from "./types";
import { checkForWinner, computeMoveIdx, validateCoordinate } from "./utilities";

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

router.put("/api/games", usernameAuth, async (ctx: Koa.Context) => {
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

  const gameState = JSON.parse(g.state as string); // TODO: fix the entity!

  // Check whether the attempted move is a valid one.
  const move: IMove = {
    x: ctx.request.body.x,
    y: ctx.request.body.y,
    username: ctx.username,
  };
  const moveIdx: number = computeMoveIdx(gameState, move);

  if (moveIdx === -1) {
    ctx.status = 400;
    ctx.body = {
      error: `The move ${JSON.stringify(move)} is invalid!`,
    };
    return;
  }

  // The attempted move has been validated, so go on to actually perform it.
  gameState[move.x][move.y] = {
    moveIdx: moveIdx,
    username: ctx.username,
  };
  g.state = JSON.stringify(gameState);
  await gamesRepository.save(g);

  ctx.body = {
    id: g.id,
    state: JSON.parse(g.state),
  };
});

router.get("/api/games", usernameAuth, async (ctx: Koa.Context) => {
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

  const gameState = JSON.parse(g.state as string); // TODO: fix the entity!

  const winner: string | null = checkForWinner(gameState);

  /*
  const responseBody = {
    winner,
    id: g.id,
    state: JSON.parse(gameState),
  }

  if (winner === null) {
    ctx.body = responseBody;
    return
  } else {
    ctx.body = {
      winner
      message: 
    }

    // TODO: clean up the DB
  }
  */
  console.log("gameState");
  console.log(gameState);
  ctx.body = {
    winner,
    id: g.id,
    state: gameState,
  };

  if (winner !== null) {
    // TODO: clean up the DB
  }
});

export { router };
