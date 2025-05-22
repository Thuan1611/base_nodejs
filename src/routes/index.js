import { Router } from "express";
import productsRouter from "./productsRouter.js";
import categoryRoutes from "./categoryRoutes.js";
const routes = Router();

routes.use("/products", productsRouter)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)

routes.use("/categories", categoryRoutes);

export default routes;
