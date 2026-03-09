import Connection from "../../models/connection.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getConnection = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cheakConnections = await Connection.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    })

    if (cheakConnections.length === 0) {
        throw new ApiError(404, "No connections found")
    }

    return res.status(200).json(
        new ApiResponse(200, cheakConnections, "Connections fetched successfully")
    )
})

export { getConnection }