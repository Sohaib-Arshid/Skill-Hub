import jwt from "jsonwebtoken"
const authMiddleware = async(req, res, next) => {
    try {
        const header = req.headers.authorization

        if (!header) {
            return res.status(401).json({ massage: "No token Provided" })
        }

        const token = header.split(" ")[1]
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

export default authMiddleware