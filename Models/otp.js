const Mongoose=require("mongoose");

const OtpSchema=new Mongoose.Schema({
    otp:String,
    verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports=Mongoose.model("Otp-model",OtpSchema);