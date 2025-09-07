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
  nextDate: { type: Date },
  amount: Number,
  nav: Number,
  units: Number,
  reminderSent: { type: Boolean, default: false }, // 👈 new field

});

const UserInvestments = model("UserInvestments", userInvestmentSchema);
export default UserInvestments;
