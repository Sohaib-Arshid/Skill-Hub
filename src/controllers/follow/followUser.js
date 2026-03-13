import Follow from "../../models/follow.models.js";
import User from "../../models/user.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const FollowUser = asyncHandler(async (req, res) => {
    const follower = req.user._id;
    const following = req.params.id;

    if (follower.toString() === following.toString()) {
        throw new ApiError(400, "You can not sand follow request to yourself")
    }

    const existing = await Follow.findOne({follower, following})

    if (existing) {
        throw new ApiError(400, "Already following")
    }

    const user = await User.findById(following)

    const status = user.isPrivate ? "pending" : "accepted"

    const createFollow = await Follow.create({
        follower,
        following,
        status,
    })

    return res.status(200).json(
        new ApiResponse(200, createFollow, "Follow Request send successfully")
    )
})


export { FollowUser }