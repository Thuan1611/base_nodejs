const validBodyRequest = (schema) => (req, res, next) => {
	try {
		const data = schema.parse(req.body);
		req.body = data;
		next();
	} catch (error) {
		const errorList = error.errors.map((err)=>{
			return{
				message: err.message,
				path: err.path.join(".")
			}
		})
		console.log(errorList,"errorList");
		
		res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errorList});
	}
};

export default validBodyRequest;
