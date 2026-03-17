const express = require('express')

const app = express()
    let data = [{
        name:'user1',
        age:20,
        city:"lahore"
    },
    {
        name:'user2',
        age:21,
        city:"Lahore"
    }
]

app.use("/data", (req, res)=>{

    res.send(JSON.stringify(data))
})

app.use("/", (req, res)=>{
    res.send("DevConnect Inc.")
})

app.listen(3000, ()=>{
    console.log('server is running on port: 3000')
})