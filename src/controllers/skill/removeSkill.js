import Skill from "../../models/skill.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const deleteSkill = asyncHandler(async (req, res) => {

    const skillId = req.params.id;

    const skill = await Skill.findById(skillId);
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    if (skill.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this skill");
    }

    const deletedSkill = await Skill.findByIdAndDelete(skillId);

    return res.status(200).json(
        new ApiResponse(200, deletedSkill, "Skill deleted successfully")
    );
});

export { deleteSkill };