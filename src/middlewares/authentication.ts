import { Request, Response, NextFunction } from "express";
import { NativeError } from "mongoose";

import { logger } from "../util/logger";
import { User, UserDocument } from "../models/User";
import { JsendFail } from "../util/jsend";

export async function Authenticate (req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  logger.debug("middleware.authenticate.req.headers.authorization: " + authHeader);

  const authToken = authHeader?.split("Token ")[1];
  logger.debug("middleware.authenticate.authToken: " + authToken);

  if (!authToken) {
    return JsendFail(res, {Authorization: ["Unauthorized"]}, 401);
  }

  const user =  await User.findOne({ token: authToken }, (_: NativeError, user: UserDocument) => {
    logger.debug("middleware.authenticate.user: " + JSON.stringify(user));
    return user;
  });

  if (!user) {
    return JsendFail(res, {Authorization: ["Unauthorized - user not found"]}, 401);
  }

  res.locals.user = user;

  next();
}
