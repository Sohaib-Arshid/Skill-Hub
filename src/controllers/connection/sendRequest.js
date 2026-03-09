import Connection from "../../models/connection.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const sendRequest = asyncHandler(async (req , res)=>{
    const sender = req.user._id;
    const reciver = req.perams.id

    const existingRequest = await Connection.findOne({
        sender : senderId,
        receiver : reciverId
    })

    if(existingRequest){
        throw new ApiError(401 , "Request is already send")
    }
    
})
