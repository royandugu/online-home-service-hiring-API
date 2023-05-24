const Mongoose=require("mongoose");

const chatSchema=new Mongoose.Schema({
    user_id:{
        type: Mongoose.Types.ObjectId,
        required:[true, "User id must be preseUser id nt"]
    },
    worker_id:{
        type: Mongoose.Types.ObjectId,
        required:[true, "Worker id must be present"]
    },
    messages:{
        type: [{
        sender_id: Mongoose.Types.ObjectId,
        reciever_id: Mongoose.Types.ObjectId,
        data:String,
        sentDate:Date
        }],
        required:[true, "Message must be present"]
    }
},{timestamps:true})

module.exports=Mongoose.model("chat-model",chatSchema);