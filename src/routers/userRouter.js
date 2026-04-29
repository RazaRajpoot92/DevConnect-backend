const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const userRouter = express.Router()

const USER_SAFE_DATA = ["firstName", "lastName", "age","gender", "photoUrl", "skills", "about"]

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

userRouter.get('/user/feed', userAuth, async(req, res)=>{

    try{

        let page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit>50?50:limit
        let skip = (page - 1) * limit

        const loggedInUser = req.user

        const connections = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        }).select("toUserId fromUserId")

        const hideUserFromFeed = new Set()

        connections.forEach(connection =>{
            hideUserFromFeed.add(connection.fromUserId)
            hideUserFromFeed.add(connection.toUserId)
        })

        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        return res.status(200).json({
            success:true,
            data:users
        })


    }catch(error){
        return res.status(400).json({
            success:false,
            message: error.message
        })
    }
})


module.exports = userRouter