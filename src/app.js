const express = require('express')
const connectDB = require("./config/database.js")
const app = express()


connectDB().then(()=>{
    console.log("DB has been connected")    
    app.listen(3000, ()=>{
        console.log('server is running on port: 3000')
    })

}).catch((err)=>{
    console.log("Something went wrong,", err.message)
})
