const Mongoose=require("mongoose");

const hiringRecordSchema=new Mongoose.Schema({
    user_id:{
        type:Mongoose.Types.ObjectId,
        required:[true, "User id must be present"]
    },
    worker_id:{
        type:Mongoose.Types.ObjectId,
        require:[true , "Worker id must be present"]
    },
    serviceDate:{
        type:Date,
        required:[true , "Service date must be present"]
    }
},{timestamps:true})

module.exports=Mongoose.model("hiring-record-model",hiringRecordSchema);