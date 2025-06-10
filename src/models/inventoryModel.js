import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
      unique: true,
    },
    quantity: { type: Number, required: true, default: 0 },
    last_updated: { type: Date, default: Date.now },
    note: { type: String, default: "Quản lý tồn kho theo biến thể sản phẩm." },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "last_updated" },
  }
);

export default mongoose.model("Inventory", inventorySchema);
