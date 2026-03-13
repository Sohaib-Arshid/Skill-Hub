import User from "../../models/user.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user

    if (!_id) {
        throw new ApiError(404, "User not found")
    }
    const { name, bio, skills , password} = req.body;
    const update = await User.findByIdAndUpdate(
        _id,
        { name, bio, skills , password },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(201, update, "user update successfully")
    )
})

export { updateUser }