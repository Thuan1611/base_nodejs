import categoryModel from "../models/categoryModel.js";
import Product from "../models/products.model.js";

class productsController{
	//Lấy danh sách sản phẩm
	async getAllProducts (req,res){
	try {
		const products = await Product.find().populate("category_id","name");
		res.status(200).json({
			message : "Lấy danh sách thành công ",
			data: products
		})
	} catch (error) {
		res.status(400).json({
			message : error.message
		})
	}	
};
//Lấy sản phẩm chi tiết
	async getProductsById (req,res){
		try {
			const id = req.params.id;
			console.log(id);
			
			const products = await Product.findById(id).populate("category_id","name");
			res.status(200).json({
				message : "Lấy danh sách thành công theo id",
				data: products
			})
		} catch (error) {
			res.status(400).json({
				message : error.message
			})
		}	
	};
//Thêm mới sản phẩm
	async AddProducts(req,res){
		try {
			const categories = await categoryModel.find();
			console.log(categories);
			const body = req.body;
			const products = await Product.create(body);
			return res.status(200).json({
			message : "Thêm sản phẩm thành công",
			data: products
		})
		} catch (error) {
			res.status(400).json({
			message : error.message,
			
		})
		}
	}
//Sửa sản phẩm
	async UpdateProducts(req,res){
		try {
			const categories = await categoryModel.find();
			const id = req.params.id;
			console.log(categories);
			const body = req.body;
			const products = await Product.findByIdAndUpdate(id,body,{new:true});
			return res.status(200).json({
			message : "Sửa sản phẩm thành công",
			data: products
		})
		} catch (error) {
			res.status(400).json({
			message : error.message,
			
		})
		}
	}
//Xóa sản phẩm
	async DeleteProducts(req,res){
		try {
			const categories = await categoryModel.find();
			const id = req.params.id;
			console.log(categories);
			const body = req.body;
			const products = await Product.findByIdAndDelete(id);
			return res.status(200).json({
			message : "Xóa sản phẩm thành công",
			data: products
		})
		} catch (error) {
			res.status(400).json({
			message : error.message,
			
		})
		}
	}
}
export default productsController