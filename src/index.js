import { connectdb } from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({ path: "./env" })
import app from "./app.js"

connectdb()
    .then(() => {
        const server = app.listen(process.env.PORT, () => {
            console.log(`server is listing on ${process.env.PORT}`);
        })

        server.on("error", (error) => {
            console.log("Error in port", error);
        })
    })
    .catch((error) => {
        console.log("Error in server connection !!", error);
    })