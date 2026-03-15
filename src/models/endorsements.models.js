import mongoose from "mongoose";

const endorsSchema = new mongoose.Schema({
    endorser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Skill",
        required: true,
    }
}, {
    timestamps: true
})

endorsSchema.index({ endorser: 1 , recevier: 1 , skill: 1 }, { unique: true })

const Endors = mongoose.model("Endors", endorsSchema)

export { Endors }