import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    note: { type: String, default: "Kích thước SP" },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

//Lọc các bản ghi chưa bị xóa mềm
sizeSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

export default mongoose.model("Size", sizeSchema);
