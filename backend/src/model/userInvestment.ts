import { Schema, model } from "mongoose";

const userInvestmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  schemeCode: { type: String, required: true },
  schemeName: { type: String },
  frequency: {
    type: String,
    default: "MONTHLY",
  },
  startDate: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
  amount: Number,
  nav: Number,
  units: Number,
});

const UserInvestments = model("UserInvestments", userInvestmentSchema);
export default UserInvestments;
