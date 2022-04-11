import Koa from "koa";
import { Repository, getConnection } from "typeorm";

import { connectionName } from "./constants";
import { User } from "./entities";

export const usernameAuth = async (ctx: Koa.Context, next: () => Promise<any>) => {
  // Look at the request's Authorization header.
  const authHeader = ctx.request.headers.authorization;
  if (authHeader === undefined) {
    ctx.status = 401;
    ctx.body = {
      error: "authentication required - via Bearer token",
    };
    return;
  }

  // Drop the word "Bearer"
  const username = authHeader.split(" ")[1];

  const usersRepository: Repository<User> =
    getConnection(connectionName).getRepository(User);

  const u: User | undefined = await usersRepository.findOne({ username });
  if (u === undefined) {
    ctx.status = 401;
    ctx.body = {
      error: "authentication required - incorrect 'username'",
    };
    return;
  }

  ctx.username = username;
  await next();
};
