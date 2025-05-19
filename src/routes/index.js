import { Router } from "express";
import categoryRoutes from "./categoryRoutes.js";

const routes = Router();

// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)
// routes.use("/products", hanldeProduct...)

routes.use("/categories", categoryRoutes);

export default routes;
