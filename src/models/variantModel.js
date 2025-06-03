import { query } from "express-validator";
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    product_id: { type: Number, required: true },
    size_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    sku: { type: String, required: true },
    additional_price: { type: Number },
    image_url: { type: String },
    note: { type: String, default: "Biến thể sản phẩm." },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

variantSchema.pre("find", function (next) {
  // lọc các bản ghi chưa bị xóa mềm
  if (!this.getFilter().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model("Variant", variantSchema);
