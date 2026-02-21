import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constan.js";

export const connectdb = async ()=>{
    try {
        const connectioninstant = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Database are connected !! HOST ${connectioninstant.connection.host}`);
    } catch (error) {
        console.error("Error" , error)
        process.exit(1)
    }
}
