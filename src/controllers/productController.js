import categoryModel from "../models/categoryModel.js";
import Product from "../models/products.model.js";
import createError from "../utils/createError.js";

class productsController {
  //Lấy danh sách sản phẩm
  async getAllProducts(req, res) {
    // Phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Lấy tổng số sản phẩm
    const totalLength = await Product.countDocuments();

    //populate: Lấy thông tin từ phía category
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate("category_id", "name");
    return res.status(200).json({
      status: "success",
      message: "Lấy danh sách thành công hehe",
      totalLength,
      currentPage: page,
      data: products || []
    });
  }

  //Lấy sản phẩm chi tiết
  async getProductsById(req, res) {
    try {
      const id = req.params.id;
      const products = await Product.findById(id).populate("category_id", "name");
  
      if (!products) {
        return createError(401, "Bạn chưa thêm sản phẩm");
      }
      return res.success(products, "Lấy danh sách thành công theo id")
    } catch (error) {
        return createError(500, error);
      
    };
  }
  //Thêm mới sản phẩm
  async AddProducts(req, res) {
    const body = req.body;
    const products = await Product.create(body);
    return res.success(products, "Thêm sản phẩm thành công");
  }
  //Sửa sản phẩm
  async UpdateProducts(req, res) {
    const id = req.params.id;
    const body = req.body;
    const products = await Product.findByIdAndUpdate(id, body, { new: true });
    return res.success(products, "Sửa sản phẩm thành công");
  }
  //Xóa sản phẩm
  async DeleteProducts(req, res) {
    const id = req.params.id;
    const products = await Product.findByIdAndDelete(id);
    return res.success(products, "Xóa sản phẩm thành công");
  }
}
export default productsController;
