import { Router } from "express";
import productsRouter from "./productsRouter.js";

const routes = Router();

routes.use("/products", productsRouter)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)

export default routes;
