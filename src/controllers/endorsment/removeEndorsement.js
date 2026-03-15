import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Endors } from "../../models/endorsements.models.js";

const removeEndors = asyncHandler(async (req, res) => {

    const endorser = req.user._id;
    const receiver = req.params.receiverId;
    const skill = req.params.skillId;

    const endorseExist = await Endors.findOne({ endorser, receiver, skill });

    if (!endorseExist) {
        throw new ApiError(404, "Endorsement not found");
    }

    const deletedEndorsement = await Endors.findByIdAndDelete(endorseExist._id);

    if (!deletedEndorsement) {
        throw new ApiError(404, "Endorsement not found")
    }

    return res.status(200).json(
        new ApiResponse(200, deletedEndorsement, "Endorsement removed successfully")
    );
});

export { removeEndors };