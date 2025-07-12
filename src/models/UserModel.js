import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
     type:String,
     required:true,
     unique:true
    },
    password:{
     type:String,
     required:true,
    },
    profile:{
        type:String,
        default:""
    }
},{timestamps:true})



let User = mongoose.model("User",userSchema)
export default User