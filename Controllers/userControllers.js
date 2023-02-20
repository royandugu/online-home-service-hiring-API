//Other dependencies
require("dotenv").config();

const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");

const {StatusCodes}=require("http-status-codes");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const AuthenticationError = require("../Error_Handlers/authenticationError");
const UserModel=require("../Models/user");
const OtpModel=require("../Models/phoneOtp");


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

//Register
const register=async (req,res)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName || !password) throw new BadRequestError("First name or the last name or the password is not avaliable");
    
    if(!email) {
        const result=await UserModel.create({...req.body});
        return res.status(StatusCodes.CREATED).json({user:result,message:"User created"});        
    }
    else{
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            },
        });
    
        const info = await transporter.sendMail({
            from: '"Event Right 👻" <eventRight@example.com>', 
            to: email, 
            subject: "Email Validation ✔",
            text: "Please click the login button to validate that the email is yours", 
            html: "<button> Login </button>",  
        });
        
        res.status(StatusCodes.OK).json({message:"Email message sent"});
    }
}

//Login
const login=async (req,res)=>{

}
module.exports={sendPhoneOtp,validatePhoneOtp,register,login};