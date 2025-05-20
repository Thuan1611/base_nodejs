import express from "express";
import { body, param } from "express-validator";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories (excluding soft-deleted ones)
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", categoryController.getAllCategories); //lấy dánh sach category( chưa xóa mềm)

/**
 * @swagger
 * /categories/deleted:
 *   get:
 *     summary: Get all soft-deleted categories
 *     responses:
 *       200:
 *         description: A list of soft-deleted categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/deleted", categoryController.getDeletedCategories); //xem danh sách xóa mềm

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID (excluding soft-deleted ones)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found or soft deleted
 */
router.get("/:id", categoryController.getCategoryById); //lấy chi tiết category theo id

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("image").optional().isURL().withMessage("Image must be a valid URL"),
  ],
  categoryController.createCategory
); //tạo mới category

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category (excluding soft-deleted ones)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found or soft deleted
 *       400:
 *         description: Invalid input
 */
router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid category ID"),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name is required if provided"),
    body("slug")
      .optional()
      .notEmpty()
      .withMessage("Slug is required if provided"),
    body("image").optional().isURL().withMessage("Image must be a valid URL"),
  ],
  categoryController.updateCategory
); //cập nhật category

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Soft delete a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category soft deleted
 *       404:
 *         description: Category not found
 *       400:
 *         description: Category already soft deleted
 */
router.delete("/:id", categoryController.deleteCategory); //xóa category vĩnh viễn

/**
 * @swagger
 * /categories/soft-delete/{id}:
 *   delete:
 *     summary: Soft delete a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category soft deleted
 *       404:
 *         description: Category not found
 *       400:
 *         description: Category already soft deleted
 */
router.delete("/soft-delete/:id", categoryController.deleteCategorySoft); // xóa mềm category

/**
 * @swagger
 * /categories/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       400:
 *         description: Category is not soft deleted
 */
router.patch(
  "/:id/restore",
  [param("id").isMongoId().withMessage("Invalid category ID")],
  categoryController.restoreCategory
); //khôi phục category đã xóa mềm

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         slug:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         note:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *       required:
 *         - name
 *         - slug
 */

export default router;
