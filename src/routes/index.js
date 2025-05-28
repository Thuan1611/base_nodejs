import { Router } from "express";
import categoryRoutes from "./categoryRoutes.js";
import variantRoutes from "./variantRoutes.js";

const routes = Router();

// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)

routes.use("/categories", categoryRoutes);
routes.use("/variants", variantRoutes);
export default routes;
