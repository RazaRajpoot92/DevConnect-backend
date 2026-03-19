const adminAuth = (req, res, next)=>{
    const token = "xyz"
    const isAutherized = (token === "xyz")

    if(!isAutherized){
        res.status(401).send("You are not authorized")
    }else{
        next()
    }
    
}



module.exports = {
    adminAuth,
}