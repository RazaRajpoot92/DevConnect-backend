const mongoose = require("mongoose")

const {URI} = require("../../secret.js")

const connectDB = async ()=>{
 await mongoose.connect(URI)
}


module.exports =  connectDB


