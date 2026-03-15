import mongoose from "mongoose";
import User from "../../models/user.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Endors } from "../../models/endorsements.models.js";
import { Skill } from "../../models/skill.models.js";

const endorseSkill = asyncHandler(async (req, res) => {

    const endorser = req.user._id;
    const receiver = req.params.receiverId;
    const skill = req.params.skillId;

    if (endorser.toString() === receiver) {
        throw new ApiError(400, "You cannot endorse your own skill");
    }

    if (!mongoose.Types.ObjectId.isValid(skill)) {
        throw new ApiError(400, "Invalid skill id");
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
        throw new ApiError(404, "Receiver user not found");
    }

    const skillExists = await Skill.findById(skill);

    if (!skillExists) {
        throw new ApiError(404, "Skill not found");
    }

    const endorsementExists = await Endors.findOne({ endorser, receiver, skill });

    if (endorsementExists) {
        throw new ApiError(400, "You already endorsed this skill");
    }

    const createEndorse = await Endors.create({
        endorser,
        receiver,
        skill
    });

    return res.status(201).json(
        new ApiResponse(201, createEndorse, "Endorsement successful")
    );
});

export { endorseSkill };