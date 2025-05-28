// seed/seedAll.js
import mongoose from "mongoose";
import seedCategories from "./seedCategories.js";
import seedColors from "./seedColors.js";
import seedSizes from "./seedSizes.js";
import seedVariants from "./seedVariants.js";

const MONGODB_URI =
  "mongodb+srv://nguyenquangq111:KuuFHGYM2gEDY0NS@cluster0.vfl5csy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function seedAll() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Seed từng phần
    // await seedCategories(); // gọi hàm seed để tạo dữ liệu giả
    await seedSizes();
    await seedColors();
    await seedVariants();

    console.log("Tất cả dữ liệu đã được seed!");
  } catch (err) {
    console.error("SeedAll lỗi:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedAll();
