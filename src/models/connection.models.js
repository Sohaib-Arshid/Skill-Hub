import mongoose, { Schema } from "mongoose";

const connnectionSchema = new mongoose.Schema({
    sender : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiver : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "accepted", "rejected"],
        default : "pending"
    }
},{
    timestamps : true
})

const Connection = mongoose.model("Connection" , connnectionSchema)

export default Connection
