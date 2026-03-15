import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ limit: "20kb", extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

import router from "./routes/auth.routes.js"
import userrouter from "./routes/user.routes.js"
import searchRouter from "./routes/search.routes.js"
import connectionrouter from "./routes/connection.routes.js"
import followRouter from "./routes/follow.routes.js"
import endorseRouter from "./routes/endorsement.routes.js"

app.use("/api/auth", router)
app.use("/api/user", userrouter)
app.use("/api/search", searchRouter)
app.use("/api/connection", connectionrouter)
app.use("/api/follow", followRouter)
app.use("/api/endorsment", endorseRouter )

export default app