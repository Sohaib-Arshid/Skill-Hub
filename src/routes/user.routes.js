import { Router } from "express";
import authMiddleware from "../middlewares/auth.meddleware.js";
import { updateUser } from "../controllers/user/updateUser.js";
import { getUser } from "../controllers/user/getuser.js"

const userrouter = Router()

userrouter.get("/:id", getUser)
userrouter.patch("/updateProfile", authMiddleware, updateUser)

export default userrouter