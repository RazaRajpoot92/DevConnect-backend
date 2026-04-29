const mongoose = require("mongoose")
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength: 3,
        maxLength: 50,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        minLength:3,
        maxLength: 50,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true,
        maxLength: 254,
        validate: {
            validator:(value) => validator.isEmail(value),
            message:"Please Enter valid Email"
        }
        
    },
    password:{
        type:String,
        required:true,
        maxLength:100,
        minLength:8,
        validate:{
            validator: (value)=> validator.isStrongPassword(value),
            message:"Please Enter stron password"
        }
        
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:100,
    },

    gender:{
        type:String,
        lowercase:true,
        enum:{
            values: ["male","female","others"],
            message:"Value not support, please enter correct gender"
        },
    },

    photoUrl: {
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate: {
            validator: (value) => validator.isURL(value),
            message:"Please enter valid url"
        }
    },
    about:{
        type:String,
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

userSchema.methods.getJWT = function(){
    const user = this
    const token = jwt.sign({"_id":user._id}, "What@isthis12", {expiresIn:"7d"})
    return token
}

userSchema.methods.validatePassword = async function(password){
    const user = this
    const isValidPassword = await bcrypt.compare(password, user.password)

    return isValidPassword
}


const User = mongoose.model("User", userSchema)

module.exports = User