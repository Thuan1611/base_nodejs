import createError from "../utils/createError.js"

export const checkAdmin = async(req,res,next)=>{
    if(req.user.role !== "admin"){
        return next(createError(400,"Chỉ có admin mới được quyền này"));
    }
    next();
}
export const checkUser = async(req,res,next)=>{
    if(req.user.role !== "user"){
        return next(createError(400,"Chỉ có user mới được quyền này"));
    }
}