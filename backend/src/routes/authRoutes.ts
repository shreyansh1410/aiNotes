import express from "express";
import { signup, login, verifyToken } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authMiddleware, verifyToken);

export default router;
