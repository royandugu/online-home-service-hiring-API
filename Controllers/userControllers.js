//Other dependencies
require("dotenv").config();
const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const AuthenticationError = require("../Error_Handlers/authenticationError");
const UserModel=require("../Models/user");

const queryObject={};

const sendOtp=async (req,res)=>{
    const {phoneNumber} = req.body;
    if(!phoneNumber || phoneNumber.length!=10) throw new BadRequestError("The phone number does not match with the expected format");
    const currentOtp=otpGenerator.generate(6);
    
    //send the OTP to user's device await
    queryObject.currentOtp=currentOtp;
    //response
}
const validateOtp=async (req,res)=>{
    //As a middle ware
    const {userOtp}=req.body;
    if(userOtp!==queryObject.currentOtp) throw new AuthenticationError("The provided OTP doesnot match with the one given to you");
    //response
}

const register=async (req,res)=>{
    const {name,email,role}=req.body;

}
const login=async (req,res)=>{

}
module.exports={phoneNumberValidation,register,login};