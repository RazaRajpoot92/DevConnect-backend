const express = require('express')
const {userAuth} = require('../middlewares/auth')


const profileRouter = express.Router()


profileRouter.get("/profile",userAuth, (req, res)=>{
    try{
        const user = req.user
        res.status(200).json({
            success:true,
            userData:user
        })
    }catch(erorr){
        res.status(400).json({
            success:false,
            message:erorr.message
        })
    }
})

module.exports = profileRouter