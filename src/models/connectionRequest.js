const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type: String,
        required:true,
        enum:{
            values: ["ignored","interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }

},{timestamps:true})

connectionRequestSchema.index({toUserId:1, fromUserId:1})

connectionRequestSchema.pre("save", function(){
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Invalid connection request")
    }

})

const ConnectionRequest = new mongoose.model('ConnectionRequest',connectionRequestSchema)

module.exports = ConnectionRequest