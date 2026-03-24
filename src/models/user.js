const mongoose = require("mongoose")


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
        
    },
    password:{
        type:String,
        required:true,
        maxLength:100,
        minLength:8,
        
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:100,
    },

    gender:{
        type:String,
        validate: (val)=>{
            if(!['male','female','others'].includes(val.toLowerCase())){
                return "Value not supported, please enter correct gender"
            }
        },
        lowercase:true
    },

    photoUrl: {
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

const User = mongoose.model("User", userSchema)

module.exports = User