import { Router } from "express";
import authMiddleware from "../middlewares/auth.meddleware.js";
import { sendRequest } from "../controllers/connection/sendRequest.js";
import { acceptRequest } from "../controllers/connection/acceptRequest.js";
import { rejectRequest } from "../controllers/connection/rejectRequest.js";
import { getConnection } from "../controllers/connection/getConnection.js";


const connectionrouter = Router()

connectionrouter.post("/send/:id", authMiddleware, sendRequest)
connectionrouter.patch("/accept/:id", authMiddleware,acceptRequest)
connectionrouter.patch("/reject/:id", authMiddleware,rejectRequest)
connectionrouter.get("/all", authMiddleware, getConnection)

export default connectionrouter