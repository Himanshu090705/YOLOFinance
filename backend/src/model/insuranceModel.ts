import { Schema, model } from "mongoose";

const insuranceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  policyId: { type: String, required: true },
  planName: { type: String },
  planType: {type: String},
  insurer: String,
  frequency: {
    type: String,
    default: "MONTHLY",
  },
  startDate: { type: Date, default: Date.now },
  nextDate: { type: Date },
  premium: String,
  coverage: String,
  claimRatio: String,
  reminderSent: { type: Boolean, default: false }, // 👈 new field
  isCancelled: { type: Boolean, default: false },
});

const Insurance = model("insurance", insuranceSchema);
export default Insurance;
