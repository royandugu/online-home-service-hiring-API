//Other dependencies
require("dotenv").config();

const bcrypt=require("bcryptjs");

const {StatusCodes}=require("http-status-codes");

//User defined
const BadRequestError = require("../Error_Handlers/badRequestError");
const UserModel=require("../Models/userModel");


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

    const result=await UserModel.create({...req.body});
    return res.status(StatusCodes.CREATED).json({user:result,message:"User created"});        
  
}
 
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


module.exports={register,login};