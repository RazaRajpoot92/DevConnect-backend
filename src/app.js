const express = require('express')
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const app = express()


// signup api for creating user in database thorugh usermodel

app.post("/signup", async(req, res)=>{
    const userData = {
        firstName:"Ahmad",
        lastName:"Raza",
        age:25,
        gender:"male",
        email:"raza@gmail.com",
        password:"029384092"
    }

    try{
        const user = new User(userData)
        
        await user.save()

        res.send("User has been created!")

    }catch(err){
        res.send(400).send("Error while saving.. Error:", err.message)
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
