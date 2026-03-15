import { Router } from "express"
import { allSkills } from "../controllers/skill/allSkill.js"
import { createSkill } from "../controllers/skill/createSkill.js"
import { getSkill } from "../controllers/skill/getSkills.js"
import { deleteSkill } from "../controllers/skill/removeSkill.js"
import authMiddleware from "../middlewares/auth.meddleware.js"

const skillRouter = Router()

skillRouter.post("/create" , authMiddleware,createSkill )
skillRouter.get("/my-skill" , authMiddleware,getSkill )
skillRouter.delete("/remove/:skill" , authMiddleware,deleteSkill)
skillRouter.get("/all" , allSkills)

export default skillRouter