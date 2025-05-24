import ProductVariant from "../models/variantModel.js";
import { validationResult } from "express-validator";
import Size from "../models/sizeModel.js";
import Color from "../models/colorModel.js";

// Lấy danh sách biến thể chưa xóa mềm
export const getAllVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.find()
      .populate("size_id", "name")
      .populate("color_id", "name hex_code");
    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách biến thể đã xóa mềm
export const getDeletedVariants = async (req, res) => {
  try {
    const deletedVariants = await ProductVariant.find({
      isDeleted: true,
      includeDeleted: true,
    })
      .populate("size_id", "name")
      .populate("color_id", "name hex_code");
    res.status(200).json(deletedVariants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết biến thể theo ID
export const getVariantById = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id)
      .populate("size_id", "name")
      .populate("color_id", "name hex_code");
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    if (variant.isDeleted)
      return res
        .status(404)
        .json({ message: "Variant not found (soft deleted)" });
    res.status(200).json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo biến thể mới
export const createVariant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const {
      product_id,
      size_id,
      color_id,
      sku,
      additional_price,
      image_url,
      note,
    } = req.body;
    const sizeExists = await Size.findById(size_id);
    const colorExists = await Color.findById(color_id);
    if (!sizeExists || !colorExists) {
      return res.status(400).json({ message: "Invalid size_id or color_id" });
    }

    const variant = new ProductVariant({
      product_id,
      size_id,
      color_id,
      sku,
      additional_price,
      image_url,
      note,
    });
    await variant.save();
    res.status(201).json(variant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật biến thể
export const updateVariant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    if (variant.isDeleted)
      return res
        .status(404)
        .json({ message: "Variant not found (soft deleted)" });

    const { size_id, color_id } = req.body;
    if (size_id) {
      const sizeExists = await Size.findById(size_id);
      if (!sizeExists)
        return res.status(400).json({ message: "Invalid size_id" });
    }
    if (color_id) {
      const colorExists = await Color.findById(color_id);
      if (!colorExists)
        return res.status(400).json({ message: "Invalid color_id" });
    }

    const updatedVariant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("size_id", "name")
      .populate("color_id", "name hex_code");
    res.status(200).json(updatedVariant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa mềm biến thể
export const deleteVariantSoft = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    if (variant.isDeleted)
      return res.status(400).json({ message: "Variant already soft deleted" });

    const updatedVariant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json({ message: "Variant soft deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa vĩnh viễn biến thể
export const deleteVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    await ProductVariant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Khôi phục biến thể đã xóa mềm
export const restoreVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    if (!variant.isDeleted)
      return res.status(400).json({ message: "Variant is not soft deleted" });

    const restoredVariant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, updatedAt: Date.now() },
      { new: true }
    )
      .populate("size_id", "name")
      .populate("color_id", "name hex_code");
    res.status(200).json({
      message: "Variant restored successfully",
      variant: restoredVariant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  deleteVariantSoft,
  getDeletedVariants,
  restoreVariant,
};
