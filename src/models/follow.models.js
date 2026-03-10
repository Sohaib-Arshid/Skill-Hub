import mongoose, { Schema } from "mongoose";

const followSchema = new mongoose.Schema({
    follower : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    following : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        enum : ["pending" , "accepted"],
        default : "accepted"
    },
    isBlocked : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})
followSchema.index({follower : 1 , following : 1} , {unique : true})

const Follow = mongoose.model("Follow" , followSchema)

export default Follow;