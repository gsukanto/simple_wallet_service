import mongoose from "mongoose";

export type WalletDocument = mongoose.Document & {
  id: string;
  owned_by: string;
  status: string;
  enabled_at: Date;
  balance: number;
};

const walletSchema = new mongoose.Schema<WalletDocument>(
  {
    id: { type: String, unique: true },
    owned_by: { type: String, unique: true },
    status: String,
    enabled_at: Date,
    balance: Number,
  },
);

export const Wallet = mongoose.model<WalletDocument>("Wallet", walletSchema);

export const WalletModelToObj = (walletModel: WalletDocument): any => {
  const walletObj = walletModel.toObject();
  walletObj.id = walletObj._id;
  delete walletObj._id;

  return walletObj;
}