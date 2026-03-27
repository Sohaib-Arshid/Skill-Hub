import User from "../../models/user.models.js"
import Connection from "../../models/connection.models.js"
import Follow from "../../models/follow.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    const createUser = await User.findById(id).select("-password").lean()

    if (!createUser) {
        throw new ApiError(404, "User not found")
    }

    const connections = await Connection.countDocuments({
        $or: [{ sender: id }, { receiver: id }],
        status: "accepted"
    });

    const followers = await Follow.countDocuments({
        following: id,
        status: "accepted"
    });

    const following = await Follow.countDocuments({
        follower: id,
        status: "accepted"
    });

    const userData = {
        ...createUser,
        metrics: { connections, followers, following }
    };

    return res
        .status(200)
        .json(new ApiResponse(200, userData, "Current user fetched"))
})

export { getUser }