const Mongoose=require("mongoose");

const OtpSchema=new Mongoose.Schema({
    otp:String,
    phoneNumber:{
        type: Number,
        required:[true, "Phone number is compulsary"]
    },
    verified:{
        type:Boolean,
        default:true
    },
},{timestamps:true})

OtpSchema.methods.isValid=function(){
    return this.verified;
}
OtpSchema.methods.expireOtp=function(){
    this.verified=false;
}

module.exports=Mongoose.model("Otp-model",OtpSchema);