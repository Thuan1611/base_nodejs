import Cart from "../models/cartModel.js";
import ProductVariant from "../models/variantModel.js";
import Inventory from "../models/inventoryModel.js";
import Product from "../models/products.model.js";
import { validationResult } from "express-validator";

// Lấy giỏ hàng của người dùng
export const getCart = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "updatedAt",
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = { user_id: req.user.id };

    const cart = await Cart.findOne(query).lean();

    if (!cart) {
      return res.status(200).json({
        cart: {
          user_id: req.user.id,
          items: [],
          createdAt: null,
          updatedAt: null,
          note: "",
          total_price: 0,
        },
        total: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 0,
      });
    }

    const variantIds = cart.items.map((item) => item.variant_id);
    const variants = await ProductVariant.find({ _id: { $in: variantIds } })
      .populate({
        path: "product_id",
        model: "website_clothers",
        select: "product_id name price",
      })
      .lean();

    const variantMap = new Map(variants.map((v) => [v._id.toString(), v]));

    let items = cart.items.map((item) => ({
      ...item,
      variant: variantMap.get(item.variant_id.toString()),
    }));

    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.variant?.sku.toLowerCase().includes(searchLower) ||
          item.variant?.product_id?.name.toLowerCase().includes(searchLower)
      );
    }

    items.sort(
      (a, b) =>
        new Date(b[sortBy] || b.added_at) - new Date(a[sortBy] || a.added_at)
    );

    const totalItems = items.length;
    const paginatedItems = items.slice(skip, skip + limitNum);

    res.status(200).json({
      cart: {
        user_id: cart.user_id,
        items: paginatedItems,
        createdAt: cart.created_at,
        updatedAt: cart.updated_at,
        note: cart.note,
        total_price: items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        ),
      },
      total: totalItems,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalItems / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo hoặc lấy giỏ hàng
export const createOrGetCart = async (req, res) => {
  try {
    // Lấy userId từ req.user (hỗ trợ các trường id, _id, hoặc user_id)
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID not found in token payload" });
    }

    let cart = await Cart.findOne({ user_id: userId }).lean();
    let isNewlyCreated = false;
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
      cart = cart.toObject(); // Chuyển sang plain object để đồng bộ với .lean()
      isNewlyCreated = true;
    }

    res.status(200).json({
      success: true,
      data: cart,
      message: isNewlyCreated
        ? "Cart created successfully"
        : "Cart retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { variant_id, quantity } = req.body;

    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const variant = await ProductVariant.findById(variant_id).lean();
    if (!variant) {
      return res.status(400).json({ message: "Product variant not found" });
    }

    // Lấy product dựa trên product_id (là số nguyên)
    const product = await Product.findOne({ _id: variant.product_id }).lean();

    if (!product || product.isDeleted) {
      return res.status(400).json({ message: "Product variant not available" });
    }

    const inventory = await Inventory.findOne({ variant_id }).lean();
    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient inventory" });
    }

    const price = product.price + (variant.additional_price || 0);

    const existingItemIndex = cart.items.findIndex(
      (item) => item.variant_id.toString() === variant_id.toString()
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = price;
    } else {
      cart.items.push({
        variant_id,
        quantity,
        price,
        added_at: new Date(),
      });
    }

    cart.updated_at = new Date();
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng sản phẩm
export const updateItemQuantity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { variant_id } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.variant_id.toString() === variant_id
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const inventory = await Inventory.findOne({ variant_id }).lean();
    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient inventory" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.updated_at = new Date();
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const deleteItem = async (req, res) => {
  try {
    const { variant_id } = req.params;

    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.variant_id.toString() === variant_id
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    cart.updated_at = new Date();
    await cart.save();
    res.status(200).json({ message: "Item deleted successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.updated_at = new Date();
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getCart,
  createOrGetCart,
  addItem,
  updateItemQuantity,
  deleteItem,
  clearCart,
};
