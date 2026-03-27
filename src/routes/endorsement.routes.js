import { Router } from "express";
import { endorseSkill } from "../controllers/endorsement/endorseSkill.js";
import { getEndors } from "../controllers/endorsement/getEndorsements.js";
import { removeEndors } from "../controllers/endorsement/removeEndorsement.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const endorseRouter = Router()

endorseRouter.post("/endorse/:receiverId/:skillId" , authMiddleware , endorseSkill);
endorseRouter.delete("/delete/:receiverId/:skillId" , authMiddleware , removeEndors);
endorseRouter.get("/get/:receiverId" , getEndors);

export default endorseRouter