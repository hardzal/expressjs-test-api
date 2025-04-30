import express from "express";
import productController from "../controllers/product.controller";
import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/cursor", productController.getProductPage);
router.post("/", productController.createProduct);
router.post("/users", productController.getUserProducts);
router.post("/buys", userController.buyProducts);

export default router;
