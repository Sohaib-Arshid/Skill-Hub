import { Router } from "express";
import { endorseSkill } from "../controllers/endorsment/endorseSkill.js";
import { getEndors } from "../controllers/endorsment/getEndorsements.js";
import { removeEndors } from "../controllers/endorsment/removeEndorsement.js";
import authMiddleware from "../middlewares/auth.meddleware.js";

const endorseRouter = Router()

endorseRouter.post("/endorse/:receiverId/:skillId" , authMiddleware , endorseSkill);
endorseRouter.delete("/delete/:receiverId/:skillId" , authMiddleware , removeEndors);
endorseRouter.get("/get/:receiverId" , getEndors);

export default endorseRouter