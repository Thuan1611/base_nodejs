import Category from "../models/categoryModel.js";
import { validationResult } from "express-validator";

// Lấy danh sách categories chưa xóa mềm
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // lọc các bản ghi chưa bị xóa mềm
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//lấy danh sánh categories đã xóa mềm
export const getDeletedCategories = async (req, res) => {
  try {
    const deletedCategories = await Category.find({ isDeleted: true });
    res.status(200).json(deletedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết category theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" }); // ko tìm thấy category
    if (category.isDeleted)
      return res
        .status(404)
        .json({ message: "Category not found (soft deleted)" }); //nếu category bị xóa mềm r thì trả về thông báo
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo category mới
export const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật category
export const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    if (category.isDeleted)
      return res
        .status(404)
        .json({ message: "Category not found (soft deleted)" });

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa mềm category
export const deleteCategorySoft = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    if (category.isDeleted)
      return res.status(400).json({ message: "Category already soft deleted" });

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json({ message: "Category soft deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Xóa category vĩnh viễn
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params, id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Khôi phục category đã xóa mềm
export const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    if (!category.isDeleted)
      return res.status(404).json({ message: "Category is not soft deleted" });
    const restoredCategory = await Category.findByIdAndDelete(
      req.params.id,
      {
        isDeleted: false,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    res.status(200).json({
      message: "Category restored successfully",
      category: restoredCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error, message });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategorySoft,
  getDeletedCategories,
  restoreCategory,
};
