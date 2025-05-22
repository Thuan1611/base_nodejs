import { Router } from "express";
import productsController from "../controllers/productController.js";


const productsRouter = new Router();
const productsControl = new productsController();
    
productsRouter.get('/',productsControl.getAllProducts);
productsRouter.get('/:id',productsControl.getProductsById);
productsRouter.put('/:id',productsControl.UpdateProducts);
productsRouter.post('/',productsControl.AddProducts);
productsRouter.delete('/:id',productsControl.DeleteProducts);


export default productsRouter