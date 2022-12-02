//Other dependencies
require("dotenv").config();
const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
const {StatusCodes}=require("http-status-codes");

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
    queryObject.phoneNumber=phoneNumber;
    queryObject.currentOtp=currentOtp;
    //response
    res.status(StatusCodes.OK).json({message:"OTP sent successfully"});
}
const validateOtp=async (req,res)=>{
    //As a middle ware
    const {userOtp}=req.body;
    if(userOtp!==queryObject.currentOtp) throw new AuthenticationError("The provided OTP doesnot match with the one given to you");
    //response
    res.status(StatusCodes.OK).json({message:"OTP is valid"});
}

const registerWithoutEmail=async (req,res)=>{
    //or user can just directly login using gmail API
    const {firstName,lastName,email}=req.body;
    if(!email) {
        UserModel.create(...req.body);
        const accessToken=jwt.sign({firstName:firstName},);
        res.status(StatusCodes.OK).json({message:`user ${firstName} created`, accessToken:""})
    }
    else{
        const emailOtp=otpGenerator.generate(6);
        //Send OTP to user's email
    }
    res.status(StatusCodes.OK).json({message:"Email OTP has been sent"});
}

const registerWithEmail= async (req,res)=>{

}
const login=async (req,res)=>{

}
module.exports={sendOtp,validateOtp,register,login};