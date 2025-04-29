import { Router } from "express";
import productRoute from "./product.route";
import userRoute from "./user.route";

const apiRouter = Router();

apiRouter.use("/users", userRoute);
apiRouter.use("/products", productRoute);

export default apiRouter;
