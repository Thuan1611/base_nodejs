import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {type: String,required: true, unique: true},
    password: {type: String,required: true},
    user_name:{type: String,required:true,unique:true},
    full_name:{type: String,},
    address:{type: String,},
    phone:{type: String,},
},{
    timestamps: true
})
const User = mongoose.model('Users',userSchema);
export default User;