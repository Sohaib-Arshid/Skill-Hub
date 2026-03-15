import Skill from "../../models/skill.models.js"
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createSkill = asyncHandler(async (req, res) => {

    const { name, category } = req.body;

    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    const existingSkill = await Skill.findOne({ name: name.toLowerCase(), user: req.user._id });
    if (existingSkill) {
        throw new ApiError(409, "You already have this skill");
    }

    const newSkill = await Skill.create({
        name: name.toLowerCase(),
        category,
        user: req.user._id 
    });

    return res.status(201).json(
        new ApiResponse(201, newSkill, "Skill created successfully")
    );
});

export { createSkill };