const Mongoose=require("mongoose");

const OtpSchema=new Mongoose.Schema({
    otp:String,
    verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

OtpSchema.methods.expireOtp=function(){
    this.verified=false;
}
module.exports=Mongoose.model("Otp-model",OtpSchema);