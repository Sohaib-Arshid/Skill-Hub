import User from "../../models/user.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const togglePrivateAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isPrivate: !user.isPrivate },
        { new: true }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, updatedUser, 
            updatedUser.isPrivate ? "Account is now Private" : "Account is now Public"
        )
    )
})

export { togglePrivateAccount }