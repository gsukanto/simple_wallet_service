import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  id: string;
  token: string;
};

const userSchema = new mongoose.Schema<UserDocument>(
  {
    id: { type: String, unique: true },
    token: { type: String, unique: true },
  },
);

export const User = mongoose.model<UserDocument>("User", userSchema);