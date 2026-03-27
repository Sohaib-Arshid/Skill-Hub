import jwt from "jsonwebtoken"

const authMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken 
            || req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "No token Provided" })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

export default authMiddleware