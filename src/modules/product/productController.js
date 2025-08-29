import categoryModel from "../category/categoryModel.js";
import Product from "../product/products.model.js";
import createError from "../../utils/createError.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";

class productsController {
  //Lấy danh sách sản phẩm
  async getAllProducts(req, res) {
    const { page, limit, search, sortBy, sortOrder } = req.query;
    const result = await paginateAndSearch({
      model: Product,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      searchField: "name",
      populate: {
        //populate: Lấy thông tin từ phía category
        path: "category_id",
        select: "name",
      },
      filter: { isDeleted: false },
    });

    return res.status(200).json({
      products: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  }
  //Lấy danh sách sản phẩm đã xóa mềm
  async getDeletedProducts(req, res) {
    const { page, limit, search, sortBy, sortOrder } = req.query;
    const result = await paginateAndSearch({
      model: Product,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      searchField: "name",
      populate: {
        //populate: Lấy thông tin từ phía category
        path: "category_id",
        select: "name",
      },
      filter: { isDeleted: true },
    });

    return res.status(200).json({
      products: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  }
  //Lấy sản phẩm chi tiết
  async getProductsById(req, res) {
    try {
      const id = req.params.id;
      const products = await Product.findById(id).populate(
        "category_id",
        "name"
      );

      if (!products) {
        return createError(401, "Bạn chưa thêm sản phẩm");
      }
      return res.success(products, "Lấy danh sách thành công theo id");
    } catch (error) {
      return createError(500, error);
    }
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
  //Xóa sản phẩm mềm
  async DeleteSoftProducts(req, res) {
    const id = req.params.id;
    if (!id) {
    return res.status(400).json({ message: "Thiếu ID sản phẩm" });
  }
    const products = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now()},
      { new: true }
    );
    return res.success(products, "Xóa mềm sản phẩm thành công");
  }
  //Khôi phục sản phẩm mềm
  async RestoreProducts(req, res) {
    const id = req.params.id;
    const products = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false, updatedAt: Date.now() },
      { new: true }
    );
    return res.success(products, "Khôi phục sản phẩm thành công");
  }
  //Xóa sản phẩm vĩnh viễn
  async DeleteProducts(req, res) {
    const id = req.params.id;
    const products = await Product.findByIdAndDelete(id);
    return res.success(products, "Xóa sản phẩm thành công");

  }
}
export default productsController;
