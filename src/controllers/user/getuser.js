import User from "../../models/user.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"
const getUser = asyncHandler(async (req, res) => {

    const { id } = req.params

    const createUser = await User.findById(id).select("-password")

    if (!createUser) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createUser, "Current user fetched"))
})

export { getUser }