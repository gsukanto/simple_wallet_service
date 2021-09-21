import { Request, Response, NextFunction} from "express";

import { logger } from "../util/logger";
import { JsendFail } from "../util/jsend";

import { initWalletSchema, patchWalletSchema } from "../schemas/wallet";
import { depositSchema, withdrawalSchema } from "../schemas/transaction";

export async function ValidateInitWalletRequest (req: Request, res: Response, next: NextFunction): Promise<void> {
  const validatedRequest = initWalletSchema.validate(req.body);

  if (validatedRequest.error) {
    logger.error("middleware.ValidateInitWalletRequest.validatedRequest.error: " + JSON.stringify(validatedRequest.error));
    return JsendFail(res, validatedRequest.error.details, 400);
  }

  next();
}

export async function ValidateDisableWalletRequest (req: Request, res: Response, next: NextFunction): Promise<void> {
  const validatedRequest = patchWalletSchema.validate(req.body);

  if (validatedRequest.error) {
    logger.error("middleware.ValidateDisableWalletRequest.validatedRequest.error: " + JSON.stringify(validatedRequest.error));
    return JsendFail(res, validatedRequest.error.details, 400);
  }

  next();
}

export async function ValidateDepositRequest (req: Request, res: Response, next: NextFunction): Promise<void> {
  const validatedRequest = depositSchema.validate(req.body);

  if (validatedRequest.error) {
    logger.error("middleware.ValidateDepositRequest.validatedRequest.error: " + JSON.stringify(validatedRequest.error));
    return JsendFail(res, validatedRequest.error.details, 400);
  }

  next();
}

export async function ValidateWithdrawalRequest (req: Request, res: Response, next: NextFunction): Promise<void> {
  const validatedRequest = withdrawalSchema.validate(req.body);

  if (validatedRequest.error) {
    logger.error("middleware.ValidateWithdrawalRequest.validatedRequest.error: " + JSON.stringify(validatedRequest.error));
    return JsendFail(res, validatedRequest.error.details, 400);
  }

  next();
}