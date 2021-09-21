import { Request, Response } from "express";
import { NativeError } from "mongoose";

import { logger } from "../util/logger";
import { JsendSuccess, JsendFail } from "../util/jsend";
import { User, UserDocument } from "../models/User";
import { Wallet, WalletDocument, WalletModelToObj } from "../models/Wallet";

/**
 * Initialize account for Wallet
 * @route POST /api/v1/init
 */
export async function initWallet (req: Request, res: Response): Promise<void> {
  const customer_xid = req.body.customer_xid;
  logger.debug("walletController.initWallet.req.body.customer_xid: " + customer_xid);
  
  const user =  await User.findOne({ id: customer_xid }, (_: NativeError, user: UserDocument) => {
    logger.debug("walletController.initWallet.user: " + JSON.stringify(user));
    return user;
  });

  if (!!user?.token) {
    JsendSuccess(res, { token: user.token }, 201);
    return;
  }

  JsendFail(res, { customer_xid: ["Missing data for required field."] }, 404);
  return;
}

/**
 * Get Wallet
 * View the current balance of virtual money
 * @route GET /api/v1/wallet
 */
export async function getWallet (req: Request, res: Response): Promise<void> {
  const user = res.locals.user;

  const wallet =  await Wallet.findOne({ owned_by: user.id }, (_: NativeError, wallet: WalletDocument) => {
    logger.debug("walletController.getWallet.wallet: " + JSON.stringify(wallet));
    return wallet;
  });

  if (wallet?.status && wallet.status === "enabled") {
    const walletObj = WalletModelToObj(wallet);
    JsendSuccess(res, { wallet: walletObj }, 200);
    return;
  }

  JsendFail(res, "Disabled", 404);
  return;
}

/**
 * POST Wallet
 * Enable Wallet
 * @route POST /api/v1/wallet
 */
export async function postWallet (req: Request, res: Response): Promise<void> {
  const user = res.locals.user;

  const wallet =  await Wallet.findOne({ owned_by: user.id }, (_: NativeError, wallet: WalletDocument) => {
    logger.debug("walletController.postWallet.wallet: " + JSON.stringify(wallet));
    return wallet;
  });

  if (wallet.status === "enabled") {
    return JsendFail(res, "Already enabled", 400);
  }

  wallet.status = "enabled";
  await wallet.save();

  const updatedWallet = await Wallet.findOne({ owned_by: user.id }, (_: NativeError, wallet: WalletDocument) => {
    logger.debug("walletController.postWallet.updatedWallet: " + JSON.stringify(wallet));
    return wallet;
  });

  const walletObj = WalletModelToObj(updatedWallet);
  JsendSuccess(res, { wallet: walletObj }, 201);
  return;
}

/**
 * PATCH Wallet
 * Disable Wallet
 * @route PATCH /api/v1/wallet
 */
export async function patchWallet (req: Request, res: Response): Promise<void> {
  const user = res.locals.user;
  
  const wallet =  await Wallet.findOne({ owned_by: user.id }, (_: NativeError, wallet: WalletDocument) => {
    logger.debug("walletController.patchWallet.wallet: " + JSON.stringify(wallet));
    return wallet;
  });

  if (wallet.status === "disabled") {
    return JsendFail(res, "Already disabled", 400);
  }

  wallet.status = "disabled";
  await wallet.save();

  const updatedWallet = await Wallet.findOne({ owned_by: user.id }, (_: NativeError, wallet: WalletDocument) => {
    logger.debug("walletController.patchWallet.updatedWallet: " + JSON.stringify(wallet));
    return wallet;
  });

  const walletObj = WalletModelToObj(updatedWallet);
  JsendSuccess(res, { wallet: walletObj }, 201);
  return;
}