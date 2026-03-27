const bcrypt = require('bcrypt')

const hashPassword = async (plainPassword)=>{
    const pass = await bcrypt.hash(plainPassword, 10)
    return pass
}


module.exports = {
    hashPassword
}