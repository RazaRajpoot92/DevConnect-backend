const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')

const userRouter = express.Router()

userRouter.get('/user/requests/recieved', userAuth, async (req, res)=>{
    try{

        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        })
//lksjD@99fl1
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


module.exports = userRouter