import mongoose from "mongoose";

/**
 * Withdrawal Model
 * For keep it as simple as possible
 * this withdrawal model is separated from transaction/transaction history.
 * Different approach is used for production project.
 */
export type WithdrawalDocument = mongoose.Document & {
  id: string;
  withdrawn_by: string;
  status: string;
  withdrawn_at: Date;
  amount: number;
  reference_id: string;
};

const withdrawalSchema = new mongoose.Schema<WithdrawalDocument>(
  {
    id: { type: String, unique: true },
    withdrawn_by: String,
    status: String,
    withdrawn_at: Date,
    amount: Number,
    reference_id: { type: String, unique: true },
  },
);

export const Withdrawal = mongoose.model<WithdrawalDocument>("Withdrawal", withdrawalSchema);

export const WithdrawalModelToObj = (withdrawalModel: WithdrawalDocument): any => {
  const withdrawalObj = withdrawalModel.toObject();
  withdrawalObj.id = withdrawalObj._id;
  delete withdrawalObj._id;
  delete withdrawalObj.__v;

  return withdrawalObj;
};