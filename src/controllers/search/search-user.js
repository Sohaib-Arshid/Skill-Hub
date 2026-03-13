import User from "../../models/user.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const searchUser = asyncHandler(async (req, res) => {
    const skill = req.query.skill

    if (!skill) {
        throw new ApiError(400, "Skill is required")
    }

    const searchskill = await User.find({
        skills: { $regex: skill, $options: "i" }
    }).select("-password")

    if (searchedUsers.length === 0) {
        throw new ApiError(404, "No users found with this skill")
    }

    return res.status(200).json(
        new ApiResponse(200, searchskill, "User found successfully")
    )
})

export { searchUser }