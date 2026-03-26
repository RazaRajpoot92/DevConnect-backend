const express = require('express')
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const {validateSignup} = require("./utils/validation.js")
const {hashPassword} = require("./utils/passwordHash.js")
const validator = require("validator")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth.js")
const app = express()


app.use(cookieParser())
app.use(express.json())

// signup api for creating user in database thorugh usermodel

// create user
app.post("/signup", async(req, res)=>{

    try{
        validateSignup(req)
        const {firstName, lastName, email , password, age, gender} = req.body
        const hashPass = await hashPassword(password)

        const user = new User({firstName, lastName, email, age, gender, password:hashPass})

        await user.save()

        res.status(201).json({success:true,
            message:"User has been created!"})

    }catch(err){
        res.status(400).json({success:false, error:err.message})
    }

})

app.post("/login", async(req, res)=>{

    try{
        const {email, password} = req.body
        
        if(!validator.isEmail(email)){
            throw new Error("Invalid Credential")
        }

        const user = await User.findOne({email})

        if(!user) throw new Error("Invalid Credential")
        
       const isValid = await bcrypt.compare(password, user.password)

       if(isValid){
        const token =  jwt.sign({"_id":user._id}, "What@isthis12")
        res.cookie("token",token)
        
        return res.status(200).json({
            "success":true,
            "message":"LoggedIn successfully"
        })
       }else{
        return res.status(400).json({
            "success":false,
            "message":"Invalid Credentials"
        })
       }

    
    }catch(error){
        res.status(400).json({
            "success": false,
            "message":error.message
        })
    }
})

app.get("/profile", userAuth, async (req, res)=>{
    
    try{
        
        const user = req.user
       
        res.status(200).json({
            "success":true,
            "user data":user,
        })
       
    }catch(error){
        res.status(400).json({
            "success":false,
            "message":"Invalid request"
        })
    }

})

// get user by id
app.get("/user/:id", async (req, res)=>{
    const userEmail = req.params.id
    

    try{
        const user = await User.findById(userEmail)

        res.send(user)

    }catch(err){
        res.status(400).send("something went wrong..")
    }
})

// update user (Patch)
app.patch("/user", async (req, res)=>{
    const userId = req.body.id
    //console.log(userId)
    const newUser = req.body 

    try{
        const allowedUpdate = ["id","gender", "firstName", "lastName", "photoUrl"]
        const isAllowedUpdate = Object.keys(newUser).every((k)=> allowedUpdate.includes(k))

        if(!isAllowedUpdate){
            throw new Error("Update not allowed")
        }

        const user = await User.findOneAndUpdate({_id: userId}, newUser, {runValidators:true})
       // console.log(user)
        res.send("User has been updated!")
    }catch(err){
        res.status(400).send("Something went wrong.."+ err.message)
    }
})

app.delete("/user",  async (req, res)=>{
    const id = req.body.id

    try{
        const data = await User.findOneAndDelete({_id: id})
        res.send(`User has been deleted ${data}`)
    }catch(err){
        res.send("something went wrong.")
    }
})


connectDB().then(()=>{
    console.log("DB has been connected")    
    app.listen(3000, ()=>{
        console.log('server is running on port: 3000')
    })

}).catch((err)=>{
    console.log("Something went wrong,", err.message)
})
