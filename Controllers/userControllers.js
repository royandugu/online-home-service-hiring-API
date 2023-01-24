//Other dependencies
require("dotenv").config();
const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
const {StatusCodes}=require("http-status-codes");
const http=require("https");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const AuthenticationError = require("../Error_Handlers/authenticationError");
const UserModel=require("../Models/user");
const OtpModel=require("../Models/phoneOtp");


const sendPhoneOtp=async (req,res)=>{
    const {phoneNumber} = req.body;
    const phoneOtp=otpGenerator.generate(6);
    
    //Token
    const apiToken="Bearer "+process.env.API_TOKEN;
    //body setup
    const data =JSON.stringify({
        "message": `${phoneOtp} is your Gharmai-register verification code`,
        "mobile": phoneNumber
    })

    //options setup
    const options = {
        hostname: 'sms.sociair.com',
        path: '/api/sms',
        method: 'POST',
        headers: {
            "Authorization":apiToken,
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }

    //Senting the request to sociair API
    const reqw=http.request(options,(resw)=>{
        let data="";
        resw.on('data',(chunk)=>data+=chunk);
        resw.on('end',async ()=>{
                const jsonMessage=JSON.parse(data);
                if(jsonMessage.message==="Success! SMS has been sent"){
                    await OtpModel.create({otp: phoneOtp, phoneNumber: phoneNumber, verified: true});
                    return res.status(StatusCodes.OK).json({message:jsonMessage});
                }
                else if(jsonMessage.message==="Unauthenticated") return res.status(StatusCodes.UNAUTHORIZED).json({message:jsonMessage.message});
                else if(jsonMessage.message==="Sorry! SMS could not be sent. Invalid mobile number") return res.status(StatusCodes.BAD_REQUEST).json({message:jsonMessage.message});
                else{
                    return res.status(StatusCodes.NOT_FOUND).json({message:json.message});
                }
            }
        )
        resw.on('error',(error)=>res.status(StatusCodes.NOT_FOUND).json({message:error.message}))
    })
    
    //passing our data
    reqw.write(data);
    reqw.end();
}

//Two validators
const validatePhoneOtp=async (req,res)=>{
    const {userOtp,phoneNumber}=req.body;


    if(!userOtp) throw new BadRequestError("The OTP is not present");
    if(userOtp.length!=6) throw new BadRequestError("Invalid OTP format");
    if(!phoneNumber) throw new BadRequestError("Phone number not avaliable");
    if(phoneNumber.length!=10) throw new BadRequestError("Invalid phone number");

    
    const actualOtp=await OtpModel.findOne({phoneNumber:phoneNumber});
    const isValid=actualOtp.isValid();
    
    if(!isValid) throw new AuthenticationError("The OTP provided has already expired");

    if(userOtp===actualOtp.otp) return res.status(StatusCodes.OK).json({message:"Otp validated",phoneNumber:phoneNumber});
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
        //send the email message to the user
        res.status(StatusCodes.OK).json({message:"Email message sent"});
    }
}

//Login
const login=async (req,res)=>{

}
module.exports={sendPhoneOtp,validatePhoneOtp,register,login};