//Other dependencies
require("dotenv").config();
const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
const {StatusCodes}=require("http-status-codes");
const https=require("https");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const AuthenticationError = require("../Error_Handlers/authenticationError");
const UserModel=require("../Models/user");
const OtpModel=require("../Models/phoneOtp");

//That goes in route
const sendPhoneOtp=async (req,res)=>{
    const {phoneNumber} = req.body;//inputted data invalid, check SOCIAIR API to send phoneNumber as a string or a number
    const phoneOtp=otpGenerator.generate(6);
    
    //initial request setup
    const apiToken="Bearer "+process.env.API_TOKEN;
    const endPointUrl=process.env.SOCI_URL;
    
    //body setup
    const data =JSON.stringify({
        "message": `${phoneOtp} is your Gharmai-register verification code`,
        "mobile": phoneNumber
    })

    const options = {
        hostname: 'localhost',
        path: endPointUrl,
        method: 'POST',
        headers: {
            "Authorization":apiToken,
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }

    const reqw = https.request(options, resw => {
        let data = '';
        console.log('Status Code:', resw.statusCode);
        resw.on('data', chunk => {
            data += chunk
        })
        resw.on('end', () => {
            console.log('Body: ', JSON.parse(data));
            res.status(resw.statusCode).json({body:JSON.parse(data)});
        })
    }).on('error', err => {
    console.log('Error: ', err.message)
  })

    reqw.write(data)
    reqw.end()

    // request({
    //     url: endPointUrl,
    //     method: "POST",
    //     headers:{
    //         "Authorization":apiToken,
    //         "Content-Type":"application/json",
    //         "Accept":"application/json"
    //     },
    //     json: true,   // <--Very important!!!
    //     body: data
    // }, async (error, response, body)=>{
    //     res.status(StatusCodes.OK).json({response:response,body:body});
    // });

    //Axios request
    //  axios.post(endPointUrl, data, config).then(res=> {
    //      console.log(res);
    //      res.status(StatusCodes.OK).json({message:"OTP sent successfully",phoneNumber:phoneNumber});
    //  }).catch(err=>res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.res})) 
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

    if(userOtp===actualOtp) return res.status(StatusCodes.OK).json({message:"Otp validated",phoneNumber:phoneNumber});
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