import Follow from "../../models/follow.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const BlockUser = asyncHandler(async (req, res) => {
    const blocker = req.user._id;
    const blocked = req.params.id

    const block = await Follow.findOne({
        follower: blocker, following: blocked
    })
    
    if (!block) {
        throw new ApiError(404, "No user found")
    }
    const blockfind = await Follow.findByIdAndUpdate(
        block._id,
        { isBlocked: true },
        { new: true }
    )


    return res.status(200).json(
        new ApiResponse(200, blockfind, "User blocked successfully")
    )
})

export { BlockUser }