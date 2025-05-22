import { Router } from "express";
import userControlller from "../controllers/userController.js";

const userRoutes = Router();
const userControl = new userControlller();

userRoutes.post('/signup',userControl.signUp);
userRoutes.post('/signin',userControl.signIn);
export default userRoutes