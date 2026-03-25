const validator = require('validator')

const validateSignup = (req)=>{
    const {firstName, lastName, email, password} = req.body

    if(firstName.length < 3 || firstName.length > 50){
        throw new Error("Please enter proper first name")
    }else if( !validator.isEmail(email)){
        throw new Error("Please enter correct email")
    } else if( !validator.isStrongPassword(password)){
        throw new Error("Please enter strong password")
    }

}

module.exports = {
    validateSignup
}