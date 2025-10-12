import mongoose from "mongoose";
//helper

const authSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        minlength : [3 , 'Username must be at least 3 characters long'],
        maxlength : [30 , 'Username cannot exceed 30 characters'],
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        minlength : [6 , 'Password must be at least 6 characters long'],
        select : false
    },
    role : {
        type : String,
        enum : ['user' , 'mentor'],
        default : 'user'
    }
}, { timestamps : true })

const Auth = mongoose.model('Auth' , authSchema)
export default Auth;