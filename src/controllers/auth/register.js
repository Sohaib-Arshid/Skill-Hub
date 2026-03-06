import User from "../../models/user.models.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"

const registerUser = asyncHandler(async (req, res) => {
    const { email, name, password, bio, skills } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password required")
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new ApiError(409, "Email already registered")
    }

    const user = await User.create({
        name,
        email,
        password,
        bio: bio || "",
        skills: skills || [],
        profilePic: ""
    })

    const createdUser = await User.findById(user._id).select("-password")

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

export { registerUser }