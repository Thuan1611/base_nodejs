import { Router } from "express";

const routes = Router();

routes.use("/products", productsRouter)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)

routes.use("/categories", categoryRoutes);

export default routes;
