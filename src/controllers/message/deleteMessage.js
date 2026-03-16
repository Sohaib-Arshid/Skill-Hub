import Message from "../../models/message.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const deleteMessage = asyncHandler(async (req, res) => {

    const messageId = req.params.messageId
    const userId = req.user._id

    const message = await Message.findById(messageId)

    if (!message) {
        throw new ApiError(404, "Message not found")
    }

    if (message.sender.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this message")
    }

    await Message.findByIdAndDelete(messageId)

    return res.status(200).json(
        new ApiResponse(200, null, "Message deleted successfully")
    )

})

export { deleteMessage }