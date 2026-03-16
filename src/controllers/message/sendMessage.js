import Message from "../../models/message.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const sendMessage = asyncHandler(async (req, res) => {

    const sender = req.user._id
    const receiver = req.params.receiverId
    const { content } = req.body

    if (sender.toString() === receiver.toString()) {
        throw new ApiError(400, "You cannot send message to yourself")
    }

    if (!content) {
        throw new ApiError(400, "Message content is required")
    }

    const message = await Message.create({
        sender,
        receiver,
        content
    })

    return res.status(201).json(
        new ApiResponse(201, message, "Message sent successfully")
    )

})

export { sendMessage }