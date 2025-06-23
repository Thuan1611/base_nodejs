import { Router } from "express";
import productsRouter from "../modules/product/productsRouter.js";
import categoryRoutes from "../modules/category/categoryRoutes.js";

import userRoutes from "../modules/users/users.routes.js";
import emailRouters from "../modules/email/emailRoutes.js";

import cartRoutes from "../modules/cart/cartRoutes.js";

import variantRoutes from "../modules/variant/variantRoutes.js";

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
