import { Router } from "express";
import { BlockUser } from "../controllers/follow/blockUser.js";
import { FollowUser } from "../controllers/follow/followUser.js";
import { getFollowers } from "../controllers/follow/getFollower.js";
import { getFollowing } from "../controllers/follow/getfollowing.js";
import { togglePrivateAccount } from "../controllers/follow/togglePrivateAccount.js";
import { unfollowUser } from "../controllers/follow/unfollowUser.js";
import authMiddleware from "../middlewares/auth.meddleware.js";

const followRouter = Router()

followRouter.post("/follow/:id" , authMiddleware , FollowUser)
followRouter.delete("/unfollow/:id" , authMiddleware , unfollowUser)
followRouter.get("/followers" , authMiddleware , getFollowers)
followRouter.get("/following" , authMiddleware , getFollowing)
followRouter.post("/block/:id" , authMiddleware , BlockUser)
followRouter.patch("/private" , authMiddleware , togglePrivateAccount)

export default followRouter