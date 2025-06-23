import mongoose from "mongoose";
import { string } from "zod";

const cartItemSchema = new mongoose.Schema({
  variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  added_at: { type: Date, default: Date.now },
  note: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, unique: true },
    items: [cartItemSchema],
    note: { type: String, default: "Giỏ hàng của khách hàng." },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export default mongoose.model("Cart", cartSchema);
