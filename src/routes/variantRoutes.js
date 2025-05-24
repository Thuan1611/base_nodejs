import express from "express";
import * as variantController from "../controllers/variantController.js";
import { body, param } from "express-validator";

const router = express.Router();

//Lấy danh sách tất cả biến thể chưa xóa mềm
router.get("/", variantController.getAllVariants);

//Lấy danh sách biến thể đã xóa mềm
router.get("/deleted", variantController.getDeletedVariants);

//Lấy chi tiết một biến thể theo ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid variant ID")],
  variantController.getVariantById
);

//Tạo biến thể mới
router.post(
  "/",
  [
    body("product_id")
      .isInt({ min: 1 })
      .withMessage("product_id must be a positive integer"),
    body("size_id").isMongoId().withMessage("Invalid size_id"),
    body("color_id").isMongoId().withMessage("Invalid color_id"),
    body("sku")
      .notEmpty()
      .withMessage("sku is required")
      .isLength({ min: 3 })
      .withMessage("sku must be at least 3 characters long"),
    body("additional_price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("additional_price must be a positive number"),
    body("image_url")
      .optional()
      .isURL()
      .withMessage("image_url must be a valid URL"),
    body("note").optional().isString().withMessage("note must be a string"),
  ],
  variantController.createVariant
);

//Cập nhật biến thể
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid variant ID"),
    body("product_id")
      .optional()
      .isInt({ min: 1 })
      .withMessage("product_id must be a positive integer"),
    body("size_id").optional().isMongoId().withMessage("Invalid size_id"),
    body("color_id").optional().isMongoId().withMessage("Invalid color_id"),
    body("sku")
      .optional()
      .notEmpty()
      .withMessage("sku is required")
      .isLength({ min: 3 })
      .withMessage("sku must be at least 3 characters long"),
    body("additional_price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("additional_price must be a positive number"),
    body("image_url")
      .optional()
      .isURL()
      .withMessage("image_url must be a valid URL"),
    body("note").optional().isString().withMessage("note must be a string"),
  ],
  variantController.updateVariant
);

//Xóa mềm biến thể
router.delete(
  "/soft/:id",
  [param("id").isMongoId().withMessage("Invalid variant ID")],
  variantController.deleteVariantSoft
);

//Xóa vĩnh viễn biến thể
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid variant ID")],
  variantController.deleteVariant
);

//Khôi phục biến thể đã xóa mềm
router.post(
  "/restore/:id",
  [param("id").isMongoId().withMessage("Invalid variant ID")],
  variantController.restoreVariant
);

export default router;
