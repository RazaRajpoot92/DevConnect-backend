const express = require('express')

const app = express()

app.use("/user", (req, res, next)=>{
    console.log("hanlder 1")
    //res.send("Response 1")
    next()
}, (req, res, next)=>{
    next()
    console.log("Hanlder 2")
    res.send("Response 2")
    
}, (req, res)=>{
    console.log("handler 3")
})
    

app.listen(3000, ()=>{
    console.log('server is running on port: 3000')
})