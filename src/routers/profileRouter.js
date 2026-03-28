const express = require('express')
const {userAuth} = require('../middlewares/auth')
const {validateEdit, allowedUpdateFields} = require("../utils/validation")


const profileRouter = express.Router()


profileRouter.get("/profile/view",userAuth, (req, res)=>{
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


profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    
    try{
        
        if(Object.keys(req.body).length == 0) throw new Error("No fields provided")
        
        if(!validateEdit(req)) throw new Error("Invalid data") 
        
        const loggedUser = req.user
        
        allowedUpdateFields.forEach(field => {
            if(req.body[field] !== undefined){
                loggedUser[field] = req.body[field]
            }
        })
        
        await loggedUser.save()
        
        res.status(200).json({
            success:true,
            data: loggedUser
        })

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
})

module.exports = profileRouter