const express = require('express')
const {adminAuth} = require('./middlewares/auth.js')
const app = express()

app.use("/admin", adminAuth)


app.get("/admin/sales", (req, res)=>{
    throw new Error()
    res.status(200).send("Sales Data")
})

app.get("/admin/sales/analytics", (req, res)=>{

    res.status(200).send("sales analytics data")
})

app.use('/', (err, req, res, next)=>{
    if(err){
        res.status(500).send("Something went wrong!")
    }
})

app.listen(3000, ()=>{
    console.log('server is running on port: 3000')
})