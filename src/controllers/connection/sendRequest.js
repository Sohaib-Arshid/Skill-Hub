import Connection from "../../models/connection.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const sendRequest = asyncHandler(async (req, res) => {
    const sender = req.user._id;
    const receiver = req.params.id

    const existingRequest = await Connection.findOne({
        sender: sender,
        receiver: receiver
    })

    if (existingRequest) {
        throw new ApiError(401, "Request is already send")
    }

    if (sender.toString() === receiver.toString()) {
    throw new ApiError(400, "You can not send request to yourself!")
}

    const request = await Connection.create({
        sender: sender,
        receiver: receiver,
        status: "pending"
    })

    return res.status(201).json(
        new ApiResponse(2001, request, "Request send successfully")
    )
})

export {sendRequest}