import  ApiError  from "../../utils/ApiError.js";
import  ApiResponse  from "../../utils/ApiResponse.js";
import  asyncHandler from "../../utils/asyncHandler.js";

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and password required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, {
            user: { _id: user._id, name: user.name, email: user.email },
            accessToken
        }, "Login successful"))


})
export { login }