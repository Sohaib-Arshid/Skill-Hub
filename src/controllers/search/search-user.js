import User from "../../models/user.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const searchUser = asyncHandler(async (req, res) => {
    const { skill } = req.query;
    console.log("Search Query Received:", { skill });

    try {
        let searchskill;
        if (!skill) {
            searchskill = await User.find({}).limit(12).select("-password");
        } else {
            searchskill = await User.find({
                skills: { $regex: skill, $options: "i" }
            }).select("-password");
        }

        console.log(`Found ${searchskill.length} users for skill: ${skill || 'none'}`);

        return res.status(200).json(
            new ApiResponse(200, searchskill, "User found successfully")
        )
    } catch (error) {
        console.error("Search Error:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Search failed");
    }
})

export { searchUser }