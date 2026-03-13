import  ApiResponse  from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"
const cookieOptions = {
    httpOnly: true,
    secure: true
}
const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"))
})

export {logoutUser}