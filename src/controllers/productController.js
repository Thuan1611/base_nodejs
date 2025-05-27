import categoryModel from "../models/categoryModel.js";
import Product from "../models/products.model.js";
import createError from "../utils/createError.js";

class productsController {
  //Lấy danh sách sản phẩm
  async getAllProducts(req, res) {
    //populate: Lấy thông tin từ phía category
    const products = await Product.find().populate("category_id", "name");
    return res.success(products, "Lấy danh sách thành công hehe");
  }

  //Lấy sản phẩm chi tiết
  async getProductsById(req, res) {
    const id = req.params.id;
    const products = await Product.findById(id).populate("category_id", "name");
	if(!products){
		return createError(401,"Bạn chưa thêm sản phẩm");
	}
    return res.success(products, "Lấy danh sách thành công theo id");
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
