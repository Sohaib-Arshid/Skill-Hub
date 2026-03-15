import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: String,
        trim: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
})

skillSchema.index({ name: 1 }, { unique: true })

const Skill = mongoose.model("Skill", skillSchema)

export default Skill