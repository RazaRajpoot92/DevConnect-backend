const express = require('express')
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const app = express()

app.use(express.json())

// signup api for creating user in database thorugh usermodel

// create user
app.post("/signup", async(req, res)=>{

  //  console.log(req.body)

    try{

        const allowedFields = ["firstName","lastName","email", "photUrl","age","gender","skills","password"]
        const isAllowedFields = Object.keys(req.body).every((k)=> allowedFields.includes(k))

        if(!isAllowedFields){
            throw new Error("Please enter valid fields")
        }

        const user = new User(req.body)
        //console.log(req.body)
        await user.save()

        res.status(201).json({success:true,
            message:"User has been created!"})

    }catch(err){
        res.status(400).json({success:false, error:err.message})
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
