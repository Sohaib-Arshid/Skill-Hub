import { Router } from "express"
import { searchUser } from "../controllers/search/search-user.js"

const searchRouter = Router()

searchRouter.get("/" , searchUser)

export default searchRouter