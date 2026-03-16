import Message from "../../models/message.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const getMessages = asyncHandler(async (req, res) => {

    const sender = req.user._id

    const receiver = req.params.receiverId

    const messages = await Message.find({
        $or: [
            { sender: sender, receiver: receiver },
            { sender: receiver, receiver: sender }
        ]
    }).sort({ createdAt: 1 })
    return res.status(200).json(
        new ApiResponse(200, messages, "Messages fetched successfully")
    )

})

export { getMessages }