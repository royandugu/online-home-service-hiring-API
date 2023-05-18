//Other dependencies
require("dotenv").config();

const otpGenerator=require("otp-generator");
const bcrypt=require("bcryptjs");

const {StatusCodes}=require("http-status-codes");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const AuthenticationError = require("../Error_Handlers/authenticationError");
const UserModel=require("../Models/userModel");
const OtpModel=require("../Models/phoneOtp");


//Register
const register=async (req,res)=>{
    const {firstName,lastName,phoneNumber,address,profilePic,password}=req.body;

    if(!firstName) throw new BadRequestError("First name is not present");
    if(!lastName) throw new BadRequestError("Last name is not present");
    if(!address) throw new BadRequestError("Address is not present");
    if(!password) throw new BadRequestError("Password is not present");
    if(!phoneNumber) throw new BadRequestError("Phone number is not present");

    if(!profilePic) profilePic="urlToDefault";

    //Password hashing
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt); //this is the password that will be pushed

    req.body.password=hashedPassword;

    const result=await userModel.create({...req.body});
    return res.status(StatusCodes.CREATED).json({user:result,message:"User created"});        
  
}
const sendPhoneOtp=async (req,res)=>{
    const {phoneNumber} = req.body;

    if(!phoneNumber) throw new BadRequestError("Missing phone number");
    else if(phoneNumber.length!= 10) throw new BadRequestError("Invalid phone number provided");

    const information=await OtpModel.find({phoneNumber: phoneNumber});
    
    const phoneOtp=otpGenerator.generate(6);
    
    //Token
    const apiToken="Bearer "+process.env.API_TOKEN;
    
    //options setup
    const options = {
        method: 'POST',
        headers: {
            "Authorization":apiToken,
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body:JSON.stringify({
            "message": `${phoneOtp} is your Gharmai-register verification code`,
            "mobile": phoneNumber
        })
    }

    //Senting the request to sociair API
    const sociFetcher=async()=>{
        const data=await fetch(process.env.SOCI_URL,options);
        const response=await data.json();
        return response;
    }
    
    const response=await sociFetcher();
    if(response.message === "Sorry! SMS could not be sent. Invalid mobile number") return res.status(StatusCodes.BAD_REQUEST).json({message:response.message});
    else if(response.message ==="Unauthenticated") return res.status(StatusCodes.UNAUTHORIZED).json({message:response.message});
    else if(response.message ==="Success! SMS has been sent") {
        if(information.length===0) await OtpModel.create({otp:phoneOtp , phoneNumber:phoneNumber});
        else{
            await OtpModel.findOneAndUpdate({phoneNumber:phoneNumber},{otp:phoneOtp},{new:true,runValidators:true});
        }
        res.status(StatusCodes.OK).json({message:response.message,phoneNumber:phoneNumber})
    }
    else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Unknown error occured while posting data to SOCI AIR API"}) 
}

//Two validators
const validatePhoneOtp=async (req,res)=>{
    const {userOtp,phoneNumber}=req.body;

    if(!userOtp) throw new BadRequestError("The OTP is not present");
    if(userOtp.length!=6) throw new BadRequestError("Invalid OTP format");
    if(!phoneNumber) throw new BadRequestError("Phone number not avaliable");
    if(phoneNumber.length!=10) throw new BadRequestError("Invalid phone number");

    const actualOtp=await OtpModel.findOne({phoneNumber:phoneNumber}); //get the OTP from the session
    const isValid=actualOtp.isValid();
   

    if(!isValid) throw new AuthenticationError("The OTP provided has already expired");

    if(userOtp===actualOtp.otp) {
        actualOtp.expireOtp();
        return res.status(StatusCodes.OK).json({message:"Otp validated",phoneNumber:phoneNumber});
    }
    else throw new AuthenticationError("The provided OTP doesnot match with the one assigned to you");
}


//Login
const login=async (req,res)=>{
    const {password,phoneNumber}=req.body;

    if(!phoneNumber) throw new BadRequestError("Phone number not provided");
    if(!password) throw new BadRequestError("Password not provided");

    userInfo=await UserModel.findOne({phoneNumber:phoneNumber});
    if(!userInfo) throw new BadRequestError("No user with the provided credentials exist");

    const match=await userInfo.verifyPassword(password);

    if(!match) throw new BadRequestError("Your password does not match");

    if(userInfo.verified) res.status(StatusCodes.OK).json({message:"User succesfully logged in",loginStatus:true});
}


module.exports={sendPhoneOtp,validatePhoneOtp,register,login};