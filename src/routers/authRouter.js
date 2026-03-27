const express = require('express')
const User = require('../models/user')
const {hashPassword} = require("../utils/passwordHash")
const validator = require('validator')

const authRouter = express.Router()

authRouter.post("/signup", async (req, res)=>{
    try{
        const {firstName, lastName, email, password, age, gender} = req.body
        const hashPass = await hashPassword(password)
        const user = new User({
            firstName,
            lastName,
            email,
            password:hashPass,
            age,
            gender
        })

        await user.save()

        return res.status(201).json({
            success:true,
            message:"User has been created"
        })
    
    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }

})

authRouter.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body

        if(!validator.isEmail(email)) throw new Error("Please enter valid email");

        const user = await User.findOne({email})

        if(!user) throw new Error("Please enter valild credentials");

        const isValid = await user.validatePassword(password)

        if(isValid){
            const token = user.getJWT()
            res.cookie("token",token)

            return res.status(200).json({
                success:true,
                message:"user login successfully"
            })
        }else{
            return res.status(400).json({
                success:true,
                message:"Invalid credentials"
            })
        }
        
    }catch(error){
        console.log("working..")
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
})

module.exports = authRouter




// app.post("/signup", async(req, res)=>{

//     try{
//         validateSignup(req)
//         const {firstName, lastName, email , password, age, gender} = req.body
//         const hashPass = await hashPassword(password)

//         const user = new User({firstName, lastName, email, age, gender, password:hashPass})

//         await user.save()

//         res.status(201).json({success:true,
//             message:"User has been created!"})

//     }catch(err){
//         res.status(400).json({success:false, error:err.message})
//     }

// })

// app.post("/login", async(req, res)=>{

//     try{
//         const {email, password} = req.body
        
//         if(!validator.isEmail(email)){
//             throw new Error("Invalid Credential")
//         }

//         const user = await User.findOne({email})

//         if(!user) throw new Error("Invalid Credential")
        
//        const isValid = await user.validatePassword(password)

//        if(isValid){
//         const token =  user.getJWT()
//         res.cookie("token",token)
        
//         return res.status(200).json({
//             "success":true,
//             "message":"LoggedIn successfully"
//         })
//        }else{
//         return res.status(400).json({
//             "success":false,
//             "message":"Invalid Credentials"
//         })
//        }

    
//     }catch(error){
//         res.status(400).json({
//             "success": false,
//             "message":error.message
//         })
//     }
// })