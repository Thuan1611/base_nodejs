import Category from "../../modules/category/categoryModel.js";
import { validationResult } from "express-validator";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";

// Lấy danh sách categories chưa xóa mềm
export const getAllCategories = async (req, res) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = req.query;

    const result = await paginateAndSearch({
      model: Category,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      searchField: "name",
      filter: { isDeleted: false },
    });

    res.status(200).json({
      categories: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách categories đã xóa mềm
export const getDeletedCategories = async (req, res) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = req.query;

    const result = await paginateAndSearch({
      model: Category,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      searchField: "name",
      filter: { isDeleted: true },
    });

    res.status(200).json({
      categories: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết category theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );

    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

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

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
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
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa mềm category
export const deleteCategorySoft = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.isDeleted) {
      return res.status(400).json({ message: "Category already soft deleted" });
    }

    await Category.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: "Category soft deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa vĩnh viễn category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Category deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Khôi phục category đã xóa mềm
export const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (!category.isDeleted) {
      return res.status(400).json({ message: "Category is not soft deleted" });
    }

    const restoredCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      message: "Category restored successfully",
      category: restoredCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllCategories,
  getDeletedCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategorySoft,
  deleteCategory,
  restoreCategory,
};
