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

//Sync 
const otpIsValid=(userEnteredOtp,actualOtp)=>{
    if(userEnteredOtp===actualOtp) return true;
    else return false;
}

//That goes in route
const sendPhoneOtp=async (req,res)=>{
    const {phoneNumber} = req.body;
    if(!phoneNumber || phoneNumber.length!=10) throw new BadRequestError("The phone number does not match with the expected format");
    const phoneOtp=otpGenerator.generate(6);
    
    //send the OTP to user's device await
    queryObject.phoneNumber=phoneNumber;
    queryObject.phoneOtp=phoneOtp;
    //response
    res.status(StatusCodes.OK).json({message:"OTP sent successfully"});
}

//Two validators
const validatePhoneOtp=async (req,res)=>{
    const {userOtp}=req.body;
    if(otpIsValid(userOtp,queryObject.phoneOtp)) return res.status(StatusCodes.OK).json({message:"Phone OTP is valid"});
    else {
        delete queryObject.phoneNumber;
        delete queryObject.phoneOtp;
        throw new AuthenticationError("The provided phone OTP doesnot match with the one given to you");
    }
}
const validateEmailOtp=async (req,res)=>{
    const {userOtp}=req.body;
    if(otpIsValid(userOtp,queryObject.emailOtp)) {
        UserModel.create({...queryObject});
        return res.status(StatusCodes.OK).json({message:"Email OTP is valid"})
    }
    else {
        delete queryObject.email;
        delete queryObject.emailOtp;
        throw new AuthenticationError("The provided email OTP doesnot match with the one given to you");
    }
}

//Register
const register=async (req,res)=>{
    //or user can just directly login using gmail API
    const {firstName,lastName,email}=req.body;
    
    queryObject.firstName=firstName;
    queryObject.lastName=lastName;
    
    if(!email) {
        UserModel.create({...queryObject});
        //Access token generation
        res.status(StatusCodes.OK).json({message:`user ${firstName} ${lastName} created`, accessToken:""})
    }
    else{
        const emailOtp=otpGenerator.generate(6);
        queryObject.emailOtp=emailOtp;
        //Mail the otp to the user
    }
    res.status(StatusCodes.OK).json({message:"Email OTP has been sent"});
}

//Login
const login=async (req,res)=>{

}
module.exports={sendPhoneOtp,validatePhoneOtp,validateEmailOtp,register,login};