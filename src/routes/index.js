import { Router } from "express";
import productsRouter from "./productsRouter.js";
import categoryRoutes from "./categoryRoutes.js";

import userRoutes from "./users.routes.js";
import emailRouters from "./emailRoutes.js";

import cartRoutes from "./cartRoutes.js";

import variantRoutes from "./variantRoutes.js";


const routes = Router();

routes.use("/products", productsRouter);
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)

routes.use("/categories", categoryRoutes);
routes.use("/variants", variantRoutes);

routes.use("/cart", cartRoutes);

routes.use("/users", userRoutes);
routes.use("/emails", emailRouters);

export default routes;
