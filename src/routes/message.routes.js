import { Router } from "express";
import { sendMessage } from "../controllers/message/sendMessage.js";
import { getMessages } from "../controllers/message/getMessages.js";
import { deleteMessage } from "../controllers/message/deleteMessage.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const messagerouter = Router();
messagerouter.post("/send/:receiverId", authMiddleware , sendMessage)
messagerouter.get("/conversation/:receiverId", authMiddleware , getMessages)
messagerouter.delete("/delete/:messageId", authMiddleware, deleteMessage)

export default messagerouter