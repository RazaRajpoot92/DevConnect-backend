const express = require('express')
const connectDB = require("./config/database.js")
const User = require("./models/user.js")

const cookieParser = require("cookie-parser")
const {userAuth} = require("./middlewares/auth.js")
const authRouter = require('./routers/authRouter.js')
const profileRouter = require('./routers/profileRouter.js')
const connectionRouter = require('./routers/connectionRouter.js')
const userRouter = require('./routers/userRouter.js')

const cors = require('cors')

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(authRouter)
app.use(profileRouter)
app.use(connectionRouter)
app.use(userRouter)


connectDB().then(()=>{
    console.log("DB has been connected")    
    app.listen(3000, ()=>{
        console.log('server is running on port: 3000')
    })

}).catch((err)=>{
    console.log("Something went wrong,", err.message)
})
