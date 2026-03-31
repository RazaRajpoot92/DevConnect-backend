const express = require('express')
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const connectionRouter = express.Router()


connectionRouter.post('/request/send/:status/:touserid', userAuth, async (req,res)=>{
    try{
        const toUserId = req.params.touserid
        const fromUserId = req.user._id
        const status = req.params.status

        const user = await User.findById(toUserId)

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const allowedStatus = ["interested","ignored"]
        const isValidStatus = allowedStatus.includes(status)

        if(!isValidStatus){
            return res.status(400).json({
                success:false,
                message: `${status} is not valid status type`
            })
        }

        const isConnectionAlreadyExist = await ConnectionRequest.findOne({
            $or:[
                {fromUserId, toUserId },
                {fromUserId: toUserId, toUserId:fromUserId}
            ]
        })

        if(isConnectionAlreadyExist){
            return res.status(400).json({
                success:false,
                message:"Connection Request Already Exists"
            })
        }


        const newConnectionRequest = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        })

        await newConnectionRequest.save()
        let message = status=="ignored"?"Successfully ignored the profile":"Connection request has been sent!"
        res.status(201).json({
            success:true,
            message
        })


    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }

})

connectionRouter.post("/request/review/:status/:requestid", userAuth, async (req, res)=>{
    
    
    try{
    const {requestid, status} = req.params
    const loggedInUser = req.user

    const allowedStatus = ["accepted", "rejected"]

    const isValidStatus = allowedStatus.includes(status)

    if(!isValidStatus){
        return res.status(400).json({
            success:false,
            message:`${status} is not valid type!`
        })
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestid,
        toUserId:loggedInUser._id,
        status:"interested"
    })

    if(!connectionRequest){
        return res.status(404).json({
            success:false,
            message:"Connection request not found"
        })
    }

    connectionRequest.status = status
    await connectionRequest.save()

    return res.status(201).json({
        success:true,
        message:`Connection request has been ${status}`
    })

    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
})

module.exports = connectionRouter