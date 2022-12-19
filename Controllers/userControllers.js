//primary dependencies
const axios=require("axios");

//Other dependencies
require("dotenv").config();
const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
const {StatusCodes}=require("http-status-codes");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const AuthenticationError = require("../Error_Handlers/authenticationError");
const UserModel=require("../Models/user");
const OtpModel=require("../Models/otp");

//That goes in route
const sendPhoneOtp=async (req,res)=>{
    const {phoneNumber} = req.body;
    if(!phoneNumber || phoneNumber.length!==10) throw new BadRequestError("The phone number does not match with the expected format");
    const phoneOtp=otpGenerator.generate(6);
    
    //initial request setup
    const apiToken="Bearer "+process.env.API_TOKEN;
    const config = {
        headers:{
            "Authorization":apiToken,
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    };
    const endPointUrl=process.env.SOCI_URL;

    //body setup
    const data ={
        "message": `${phoneOtp} is your Gharmai-register verification code`,
        "mobile": phoneNumber
    }

    //Axios request
    axios.post(endPointUrl, data, config).then(res=> {
        await OtpModel.create({otp:phoneOtp,phoneNumber:phoneNumber});
        res.status(StatusCodes.OK).json({message:"OTP sent successfully",phoneNumber:phoneNumber});
    }).catch(err=> console.log(err)) 

}

//Two validators
const validatePhoneOtp=async (req,res)=>{
    const {userOtp,phoneNumber}=req.body;
    if(!userOtp || userOtp.length!==10) throw new BadRequestError("Invalid OTP format detected");
    const actualOtp=await OtpModel.findOne({phoneNumber:phoneNumber});
    const isValid=actualOtp.isValid();
    if(!isValid) return new AuthenticationError("The OTP provided has already been expired");
    if(userOtp===actualOtp) return res.status(StatusCodes.OK).json({message:"Otp validated"});
    else throw new AuthenticationError("The provided OTP doesnot match with the one assigned to you");
}

//Register
const register=async (req,res)=>{
    if(!email) {
        const result=await UserModel.create({...req.body});
        res.status(StatusCodes.CREATED).json({user:result,message:"User created"});        
    }
    else{
        //send the email message to the user
        res.status(StatusCodes.OK).json({message:"Email message sent"});
    }
}

//Login
const login=async (req,res)=>{

}
module.exports={sendPhoneOtp,validatePhoneOtp,register,login};