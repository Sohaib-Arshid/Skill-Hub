import Follow from "../../models/follow.models.js";
import User from "../../models/user.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const unfollowUser = asyncHandler(async (req, res) => {
    const follower = req.user._id;
    const following = req.params.id;

    const existing = await Follow.findOne({follower, following})
    if (!existing) {
        throw new ApiError(400, "user does not exist")
    }

    const createFollow = await Follow.findOneAndDelete({
        follower,
        following,
    })

    return res.status(200).json(
        new ApiResponse(200, createFollow, "Unfollow user successfully")
    )
})


export { unfollowUser }