import { Router } from "express";
import productsController from "../product/productController.js";
import jwtMiddleware from "../../middlewares/jwt.middleware.js";
import handleAsync from "../../utils/handleAsync.js";
import { checkAdmin } from "../../middlewares/checkRoles.js";

const productsRouter = new Router();
const productsControl = new productsController();

productsRouter.get("/", handleAsync(productsControl.getAllProducts));
productsRouter.get("/:id", handleAsync(productsControl.getProductsById));
productsRouter.put(
  "/:id",
  jwtMiddleware,
  handleAsync(productsControl.UpdateProducts)
);
productsRouter.post(
  "/",
  jwtMiddleware,
  checkAdmin,
  handleAsync(productsControl.AddProducts)
);
productsRouter.delete(
  "/:id",
  jwtMiddleware,
  handleAsync(productsControl.DeleteProducts)
);

export default productsRouter;
