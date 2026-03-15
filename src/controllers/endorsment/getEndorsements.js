import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Endors } from "../../models/endorsements.models.js";

const getEndors = asyncHandler(async (req, res) => {

    const receiver = req.params.userId;

    const findEndors = await Endors
        .find({ receiver })
        .populate("endorser", "fullname username")
        .populate("skill", "name");

    if (findEndors.length === 0) {
        throw new ApiError(404, "No endorsements found");
    }

    return res.status(200).json(
        new ApiResponse(200, findEndors, "Endorsements fetched successfully")
    );
});

export { getEndors };