import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: [true, 'This username is already used'],
        index: true,
    },

    email: {
        type: String,
        lowercase: true,
        required: [true, 'Please provide an email'],
        unique: [true, 'This email is already used'],
        index: true,
    },

    password : String,
    salt : String,

    role : {
        type : String,
        default : 'user'
    }
}, {timestamps : true})

export default mongoose.model("User", UserSchema)