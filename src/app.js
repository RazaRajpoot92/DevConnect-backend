const express = require('express')
const connectDB = require("./config/database.js")
const User = require("./models/user.js")

const cookieParser = require("cookie-parser")
const {userAuth} = require("./middlewares/auth.js")
const authRouter = require('./routers/authRouter.js')
const profileRouter = require('./routers/profileRouter.js')

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(authRouter)
app.use(profileRouter)

// signup api for creating user in database thorugh usermodel

// create user


// app.get("/profile", userAuth, async (req, res)=>{
    
//     try{
        
//         const user = req.user
       
//         res.status(200).json({
//             "success":true,
//             "user data":user,
//         })
       
//     }catch(error){
//         res.status(400).json({
//             "success":false,
//             "message":"Invalid request"
//         })
//     }

// })

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
