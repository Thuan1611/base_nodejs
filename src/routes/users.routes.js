import { Router } from "express";
import userControlller from "../controllers/userController.js";
import handleAsync from '../utils/handleAsync.js'
const userRoutes = Router();
const userControl = new userControlller();

userRoutes.post('/signup',handleAsync(userControl.signUp));
userRoutes.post('/signin',handleAsync(userControl.signIn));
export default userRoutes