import express from "express";
import productController from "../controllers/product.controller";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/cursor", productController.getProductPage);
router.post("/", productController.createProduct);
router.post("/users", productController.getUserProducts);

export default router;
