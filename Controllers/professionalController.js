//Other dependencies
require("dotenv").config();

const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");

const {StatusCodes}=require("http-status-codes");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const AuthenticationError = require("../Error_Handlers/authenticationError");
const professionalModel=require("../Models/professionalModel");
const OtpModel=require("../Models/phoneOtp");
const { response } = require("express");

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
    if(userOtp.length!=6) throw new BadRequestsError("Invalid OTP format");
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
    const {firstName,lastName,email,password,profession}=req.body;
    if(!firstName || !lastName || !password) throw new BadRequestError("First name or the last name or the password is not avaliable");
    
    if(!email) {
        const result=await professionalModel.create({...req.body});
        return res.status(StatusCodes.CREATED).json({user:result,message:"User created"});        
    }
    else{
        const emailOtp=otpGenerator.generate(6);
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
            text: "The following is your email validation code", 
            html: `<h5> ${emailOtp} </h5>`,  
        });

        console.log(info);
        //if info says valid put it in our email otp
        res.status(StatusCodes.OK).json({message:"Email message sent"});
    }
}

//Login

const login=async (req,res)=> {
    const { phoneNumber, password } = req.body;
    
  
    try {
      // Find user in database
      const user = await professionalModel.findOne({ phoneNumber, password });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Return user data
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
//getAll Professioanl By profession
  const getProfessional=async (req,res)=> {
    const professional = req.params.getProfessional
   
    try {
      // Find user in database
      const professional1 =await professionalModel.findOne({ profession: professional }, '_id').exec();
      
  
      if (!professional1) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Return user data
      return res.json(professional1);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
//update and delete professional
const updateProfessional= async(req,res)=>{
  const professionalId = req.params.userId
  const professionalDetails = req.body

  try {
      const resposne  = await professionalModel.findByIdAndUpdate(professionalId,professionalDetails);
      return response
  } catch (error) {
      return error
  }

}

const deleteProfessional= async(req,res)=>{
  const userId = req.params.userId
  try {
      const resposne  = await professionalModel.findByIdAndDelete(userId);
      return response
  } catch (error) {
      return error
  }

}

const getAllProfessionals= async(req,res)=>{
  const professionalId = req.params.userId
  const professionalDetails = req.body

  try {
      const resposne  = await professionalModel.find();
      return resposne
  } catch (error) {
      return error
  }

}

const getServices= async(req,res)=>{ //lejna baki cha 
  try {
      const resposne  = await professionalModel.find();
      return response
  } catch (error) {
      return error
  }

}
  


module.exports={sendPhoneOtp,validatePhoneOtp,register,login, getProfessional,updateProfessional,deleteProfessional,getAllProfessionals};

//find

