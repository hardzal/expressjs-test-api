import express from "express";
import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/transfer", userController.transferMoney);
export default router;
