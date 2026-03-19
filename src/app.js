const express = require('express')
const {adminAuth} = require('./middlewares/auth.js')
const app = express()

app.use("/admin", adminAuth)


app.get("/admin/sales", (req, res)=>{

    res.status(200).send("Sales Data")
})

app.get("/admin/sales/analytics", (req, res)=>{

    res.status(200).send("sales analytics data")
})

    

app.listen(3000, ()=>{
    console.log('server is running on port: 3000')
})