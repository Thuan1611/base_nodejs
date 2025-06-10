import { Router } from "express";
import userControlller from "../controllers/userController.js";
import handleAsync from '../utils/handleAsync.js'
import { signInSchema, signUpSchema } from "../validations/auth.validate.js";
import validBodyRequest from "../middlewares/validBodyRequest.js";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
const userRoutes = Router();
const userControl = new userControlller();

userRoutes.post('/signup',validBodyRequest(signUpSchema),handleAsync(userControl.signUp));
userRoutes.post('/signin',validBodyRequest(signInSchema),handleAsync(userControl.signIn));
userRoutes.get('/verify-email',handleAsync(userControl.verifyEmail));
userRoutes.post('/forgot-password',handleAsync(userControl.forgotPassword));
userRoutes.post('/reset-password',handleAsync(userControl.resetPassword));
userRoutes.get('/get-profile',jwtMiddleware,handleAsync(userControl.getProfile));
userRoutes.post('/update-profile',jwtMiddleware,handleAsync(userControl.updateProfile));


export default userRoutes