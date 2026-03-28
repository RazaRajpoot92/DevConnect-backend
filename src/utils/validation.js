const validator = require('validator')

const allowedUpdateFields = [
        "firstName",
        "lastName",
        "photoUrl",
        "skills",
        "gender"
    ]


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

const validateEdit = (req)=>{
    
    const isValid = Object.keys(req.body).every(item => allowedUpdateFields.includes(item))   

    return isValid
}

module.exports = {
    validateSignup,
    validateEdit,
    allowedUpdateFields
}