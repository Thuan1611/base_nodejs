import express from "express";
import { body, param, validationResult } from "express-validator";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

const handlevalidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "eror",
      message: "Validationn failed",
      errors: errors.array(),
    });
  }
  next();
};
//Lấy tất cả category chưa bị xóa mềm
router.get("/", categoryController.getAllCategories);

//Lấy tất cả category đã bị xóa mềm
router.get("/deleted", categoryController.getDeletedCategories);

//Lấy chi tiết category theo ID (chỉ khi chưa xóa mềm)
router.get("/:id", categoryController.getCategoryById);

//Tạo mới category
router.post(
  "/",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Name must be at most 100 characters"),

    body("slug")
      .notEmpty()
      .withMessage("Slug is required")
      .isString()
      .withMessage("Slug must be a string")
      .matches(/^[a-z0-9-]+$/)
      .withMessage(
        "Slug can only contain lowercase letters, numbers and hyphens"
      ),

    body("image").optional().isURL().withMessage("Image must be a valid URL"),

    handlevalidation,
  ],
  categoryController.createCategory
);

//Cập nhật category (nếu chưa bị xóa mềm)
router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid category ID"),

    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .notEmpty()
      .withMessage("Name cannot be empty"),

    body("slug")
      .optional()
      .isString()
      .withMessage("Slug must be a string")
      .matches(/^[a-z0-9-]+$/)
      .withMessage(
        "Slug can only contain lowercase letters, numbers and hyphens"
      ),

    body("image").optional().isURL().withMessage("Image must be a valid URL"),

    handlevalidation,
  ],
  categoryController.updateCategory
);

//Xóa mềm category (soft delete)
router.delete("/soft/:id", categoryController.deleteCategorySoft);

//Xóa category vĩnh viễn
router.delete("/:id", categoryController.deleteCategory);

//Khôi phục category bị xóa mềm
router.patch(
  "/:id/restore",
  [param("id").isMongoId().withMessage("Invalid category ID")],

  handlevalidation, //validate
  categoryController.restoreCategory
);

export default router;
