import { Router } from "express";
import { login } from "../controllers/auth/login.js";
import { logoutUser } from "../controllers/auth/logout.js";
import { registerUser } from "../controllers/auth/register.js";
import { getCurrentUser } from "../controllers/auth/getCurrentUser.js";
import authMiddleware from "../middlewares/auth.meddleware.js";

const router = Router()

router.post("/register", registerUser)
router.post("/login", login)

router.post("/logout", authMiddleware, logoutUser)
router.get("/me", authMiddleware, getCurrentUser)

export default router