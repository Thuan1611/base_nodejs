import express from "express";
import {
  getCart,
  createOrGetCart,
  addItem,
  updateItemQuantity,
  deleteItem,
  clearCart,
} from "../cart/cartController.js";
import { body, param } from "express-validator";
import jwtMiddleware from "../../middlewares/jwt.middleware.js";

const router = express.Router();

router.use(jwtMiddleware);

// Lấy giỏ hàng của người dùng
router.get("/", getCart);

// Tạo hoặc lấy giỏ hàng
router.get("/create", createOrGetCart);

// Thêm sản phẩm vào giỏ hàng
router.post(
  "/items",
  [
    body("variant_id").notEmpty().withMessage("Variant ID is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ],
  addItem
);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put(
  "/items/:variant_id",
  [
    param("variant_id").notEmpty().withMessage("Variant ID is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ],
  updateItemQuantity
);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/items/:variant_id", deleteItem);

// Xóa toàn bộ giỏ hàng
router.delete("/", clearCart);

export default router;
