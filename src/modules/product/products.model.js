import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    price:{type: Number},
    description:{type: String},
    image_url:{type: String},
    isDeleted: { type: Boolean, default: false },
    category_id:{type: mongoose.Schema.Types.ObjectId, ref: "Category"},
},{
    timestamps: true,
})
const Product = mongoose.model('website_clothers',productSchema);
export default Product