import mongoose from "mongoose";

/**
 * Deposit Model
 * For keep it as simple as possible
 * this deposit model is separated from transaction/transaction history.
 * Different approach is used for production project.
 */
export type DepositDocument = mongoose.Document & {
  id: string;
  deposited_by: string;
  status: string;
  deposited_at: Date;
  amount: number;
  reference_id: string;
};

const depositSchema = new mongoose.Schema<DepositDocument>(
  {
    id: { type: String, unique: true },
    deposited_by: String,
    status: String,
    deposited_at: Date,
    amount: Number,
    reference_id: { type: String, unique: true },
  },
);

export const Deposit = mongoose.model<DepositDocument>("Deposit", depositSchema);

export const DepositModelToObj = (depositModel: DepositDocument): any => {
  const depositObj = depositModel.toObject();
  depositObj.id = depositObj._id;
  delete depositObj._id;
  delete depositObj.__v;

  return depositObj;
};