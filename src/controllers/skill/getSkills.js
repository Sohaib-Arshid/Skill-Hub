import Skill from "../../models/skill.models.js"
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getSkill = asyncHandler(async (req, res) => {

    const skills = await Skill.find({ user: req.user._id });

    if (!skills || skills.length === 0) {
        throw new ApiError(404, "No skills found for this user");
    }

    return res.status(200).json(
        new ApiResponse(200, skills, "User skills fetched successfully")
    );
});

export { getSkill }