import { Router } from "express";
import emailController from "../../modules/email/emailController.js";

const emailRouters = new Router();
const emailControl = new emailController();

emailRouters.post("/", emailControl.sendEmailController);

export default emailRouters;
