import { Router } from "express";
import productsController from "../controllers/productController.js";


const productsRouter = new Router();
const productsControl = new productsController();

productsRouter.get('/',productsControl.getAllProducts);
productsRouter.post('/',productsControl.AddProducts);

export default productsRouter