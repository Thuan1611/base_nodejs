import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex_code: { type: String, required: true },
    note: { type: String, default: " Màu SP" },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

colorSchema.pre("save", function (next) {
  this.where({ isDeleted: true });
  next();
});

export default mongoose.model("Color", colorSchema);
