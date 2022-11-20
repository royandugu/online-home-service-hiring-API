const UserModel=require("../Models/user");
const queryObject={};
const phoneNumberValidation=async (req,res)=>{
    const {phoneNumber} = req.body;
    if(!phoneNumber || phoneNumber.length!=10) return; //Exception throw
    //OTP validation
    queryObject.phoneNumber=phoneNumber;
}
const register=async (req,res)=>{
    const {name,email,role}=req.body;
}
const login=async (req,res)=>{

}
module.exports={phoneNumberValidation,register,login};