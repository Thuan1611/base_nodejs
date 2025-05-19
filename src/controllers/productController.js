import Product from "../models/products.model.js";

class productsController{
	async getAllProducts (req,res){
	try {
		const products = await Product.find();
		res.status(200).json({
			message : "Lấy danh sách thành công hehe",
			data: products
		})
	} catch (error) {
		res.status(400).json({
			message : "Lỗi"
		})
	}
};
	async AddProducts(req,res){
		try {
			const {name,price,description,image_url,category_id} = req.body;
			console.log(req.body);
			console.log("BODY nhận được:", req.body);
			const products = await Product.create(req.body);
			res.status(200).json({
			message : "Lấy danh sách thành công hehe",
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