import Follow from "../../models/follow.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const getFollowing = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const following = await Follow.find({
        follower: userId,
        status: "accepted"
    }).populate("following","name profilePic")

    if (!following || following.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No following found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, following, "Following fetched successfully")
    )
})

export { getFollowing }