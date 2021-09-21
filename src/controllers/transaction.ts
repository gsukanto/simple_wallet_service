import { Request, Response } from "express";
import { NativeError } from "mongoose";

import { logger } from "../util/logger";
import { JsendSuccess, JsendFail } from "../util/jsend";
import { Wallet, WalletDocument } from "../models/Wallet";
import { Deposit, DepositDocument, DepositModelToObj } from "../models/Deposit";
import { Withdrawal, WithdrawalDocument, WithdrawalModelToObj } from "../models/Withdrawal";


/**
 * POST Deposit
 * Add virtual money to wallet
 * @route POST /api/v1/wallet/deposits
 */
export async function postDeposit (req: Request, res: Response): Promise<void> {
  const user = res.locals.user;
  const reference_id = req.body.reference_id;
  const amount = Number(req.body.amount);

  const wallet =  await Wallet.findOne({ owned_by: user.id }, (_: NativeError, wallet: WalletDocument) => {
    logger.debug("transactionController.postDeposit.wallet: " + JSON.stringify(wallet));
    return wallet;
  });

  if (wallet?.status && wallet.status !== "enabled") {
    JsendFail(res, { wallet: ["Disabled"]}, 404);
    return;
  }

  const existedDeposit =  await Deposit.findOne({ reference_id }, (_: NativeError, deposit: DepositDocument) => {
    logger.debug("transactionController.postDeposit.existedDeposit: " + JSON.stringify(deposit));
    return deposit;
  });

  if (!!existedDeposit) {
    JsendFail(res, { reference_id: ["Conflict"]}, 409);
    return;
  }

  const now = new Date();
  const deposit = new Deposit({
    id: reference_id,
    deposited_by: user.id,
    status: "success",
    deposited_at: now.toISOString(),
    amount,
    reference_id
  });

  wallet.balance = Number(wallet.balance) + amount;
  await wallet.save();

  await deposit.save();
  const newDeposit =  await Deposit.findOne({ reference_id }, (_: NativeError, deposit: DepositDocument) => {
    logger.debug("transactionController.postDeposit.deposit: " + JSON.stringify(deposit));
    return deposit;
  });

  const depositObj = DepositModelToObj(newDeposit);
  

  JsendSuccess(res, { deposit: depositObj }, 201);
  return;
}

/**
 * POST Withdrawal
 * Use virtual money from wallet
 * @route POST /api/v1/wallet/withdrawals
 */
export async function postWithdrawal (req: Request, res: Response): Promise<void> {
  const user = res.locals.user;
  const reference_id = req.body.reference_id;
  const amount = Number(req.body.amount);

  const wallet =  await Wallet.findOne({ owned_by: user.id }, (_: NativeError, wallet: WalletDocument) => {
    logger.debug("transactionController.postWithdrawal.wallet: " + JSON.stringify(wallet));
    return wallet;
  });

  if (wallet?.status && wallet.status !== "enabled") {
    JsendFail(res, { wallet: ["Disabled"]}, 404);
    return;
  }

  const existedWithdrawal =  await Withdrawal.findOne({ reference_id }, (_: NativeError, withdrawal: WithdrawalDocument) => {
    logger.debug("transactionController.postWithdrawal.existedWithdrawal: " + JSON.stringify(withdrawal));
    return withdrawal;
  });

  if (!!existedWithdrawal) {
    JsendFail(res, { reference_id: ["Conflict"]}, 409);
    return;
  }

  const now = new Date();
  const withdrawal = new Withdrawal({
    id: reference_id,
    withdrawn_by: user.id,
    status: "success",
    withdrawn_at: now.toISOString(),
    amount,
    reference_id
  });

  wallet.balance = Number(wallet.balance) - amount;
  if (wallet.balance <= 0) {
    JsendFail(res, { balance: ["Insufficient balance"]}, 422);
    return;
  }

  await wallet.save();

  await withdrawal.save();
  const newWithdrawal =  await Withdrawal.findOne({ reference_id }, (_: NativeError, withdrawal: WithdrawalDocument) => {
    logger.debug("transactionController.postWithdrawal.newWithdrawal: " + JSON.stringify(withdrawal));
    return withdrawal;
  });

  const withdrawalObj = WithdrawalModelToObj(newWithdrawal);
  

  JsendSuccess(res, { withdrawal: withdrawalObj }, 201);
  return;
}