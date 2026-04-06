const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')

const userRouter = express.Router()

const USER_SAFE_DATA = ["firstName", "lastName", "age","gender", "photoUrl", "skills"]

userRouter.get('/user/requests/recieved', userAuth, async (req, res)=>{
    try{

        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        if(!connectionRequests){
            return res.status(404).json({
                success:false,
                message:"Not found"
            })
        }

        return res.status(200).json({
            success:true,
            data:connectionRequests
        })

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
})


userRouter.get("/user/connections", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user

        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser, status:"accepted"},
                {toUserId:loggedInUser, status:"accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        
        if(!connections){
            return res.status(404).json({
                success:false,
                message:"Not found"
            })
        }

        const data = connections.map((conn) => {
            if(conn.fromUserId._id.toString() == loggedInUser._id.toString()){
                return conn.toUserId
            }

            return conn.fromUserId
        })

        return res.status(200).json({
            success:true,
            data,
        
        })


    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
})


module.exports = userRouter