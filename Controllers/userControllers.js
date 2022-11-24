const UserModel=require("../Models/user");
const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");

const queryObject={};
const phoneNumberValidation=async (req,res)=>{
    const {phoneNumber} = req.body;
    if(!phoneNumber || phoneNumber.length!=10) return; //Exception throw Authentication error
    //OTP validation
    const currentOtp=otpGenerator.generate(6);
    //send the OTP to user's device await
    const {userOtp}=req.body;
    if(userOtp===currentOtp){
        const accessToken=jwt.sign({phoneNumber: phoneNumber},process.env.JWT_SECRET);
        //A look at JOBS API to see where these access tokens are actually stored
    }
    queryObject.phoneNumber=phoneNumber;
}
const register=async (req,res)=>{
    const {name,email,role}=req.body;

}
const login=async (req,res)=>{

}
module.exports={phoneNumberValidation,register,login};