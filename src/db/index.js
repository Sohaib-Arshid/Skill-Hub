import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectdb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Database are connected !! HOST ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error" , error)
        process.exit(1)
    }
}
