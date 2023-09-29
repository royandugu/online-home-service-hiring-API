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
    },
    message:{
        type:String,
        required:[true, "Message must be present"]
    },
    completed:{
        type:Boolean,
        required:[true, "Completed must be present"],
        deafult:false
    },
    settled:{
        type:Boolean,
        required:[true, "Settled must be present"],
        deafult:false
    },
    serviceCost:{
        type:Number,
        required:[true, "Service const must be present"],
        default:0
    }
},{timestamps:true})

module.exports=Mongoose.model("hiring-record-model",hiringRecordSchema);