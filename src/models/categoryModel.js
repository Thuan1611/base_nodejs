import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    slug: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    note: { type: String, default: "Phân loại sản phẩm." },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Tạo slug tự động trước khi lưu
categorySchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Cập nhật slug khi update
categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  next();
});

// Lọc các bản ghi chưa bị xóa mềm
categorySchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

export default mongoose.model("Category", categorySchema);

