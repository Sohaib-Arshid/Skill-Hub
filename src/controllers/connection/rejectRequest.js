import Connection from "../../models/connection.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const rejectRequest = asyncHandler(async (req, res) => {
    const receiver = req.user._id;
    const connectionId = req.params.id

    const connection = await Connection.findById(connectionId)

    if (!connection) {
        throw new ApiError(400, "Request not found")
    }

    if (connection.receiver.toString() !== receiver.toString()) {
        throw new ApiError(403, "You are not allowed to accept this request")
    }

    const rejectedrequest = await Connection.findByIdAndUpdate(
        connectionId,
        { status: "rejected" },
        { new: true }
    )

    return res.status(201).json(
       new ApiResponse(200, rejectedrequest, "Request rejected successfully")
    )
})

export { rejectRequest }