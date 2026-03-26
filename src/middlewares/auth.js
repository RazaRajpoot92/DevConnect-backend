const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next)=>{

    try{
    const {token} = req.cookies
    
    if(!token){
        throw new Error("Not found, please login")
    }
    const {_id} = jwt.verify(token, "What@isthis12")

    const user = await User.findById(_id)

    if(!user){
        throw new Error("User not found, please login")
    }
    req.user = user
    next()

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }

    
}



module.exports = {
    userAuth,
}