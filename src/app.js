import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./routes/auth.routes.js"
import userrouter from "./routes/user.routes.js"

const app = express()
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({limit : "20kb" , extended : true}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/auth" , router)
app.use("/api/user" , userrouter)

export default app