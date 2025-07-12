import mongoose from "mongoose";

const dbConnection = async()=>{
    try {
        const  connection =await mongoose.connect(process.env.MONGODB_URI)
        console.log(`connected to db`)
    } catch (error) {
        console.log(error)
    }
}
export default dbConnection