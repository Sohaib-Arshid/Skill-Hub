import Skill from "../../models/skill.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const allSkills = asyncHandler(async (req, res) => {

    const skills = await Skill.find()

    if (skills.length === 0) {
        throw new ApiError(404, "No skills found")
    }

    return res.status(200).json(
        new ApiResponse(200, skills, "Skills fetched successfully")
    )
})

export { allSkills }