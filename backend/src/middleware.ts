import Koa from "koa";
import { Repository, getConnection } from "typeorm";

import { connectionName } from "./constants";
import { User } from "./entities";

export const usernameAuth = async (ctx: Koa.Context, next: () => Promise<any>) => {
  if (!ctx.request.body.hasOwnProperty("username")) {
    ctx.status = 401;
    ctx.body = {
      error: "authentication required - provide a 'username' in the request body",
    };
    return;
  }

  const { username } = ctx.request.body;

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
