import Follow from "../../models/follow.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const getFollowers = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const followers = await Follow.find({
        following: userId,
        status: "accepted"
    }).populate("follower","name profileImage")

    if (followers.length === 0) {
        throw new ApiError(404, "No followers found")
    }

    return res.status(200).json(
        new ApiResponse(200, followers, "Followers fetched successfully")
    )
})

export { getFollowers }