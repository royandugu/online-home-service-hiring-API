const AdminModel=require("../Models/adminModel");
const BadRequestError=require("../Error_Handlers/badRequestError");
const AuthenticationError=require("../Error_Handlers/authenticationError");
const bcrypt=require("bcryptjs");

const {StatusCodes}=require("http-status-codes");

const loginAdmin=async (req,res)=>{
    const {phoneNumber,password}=req.body;

    if(!phoneNumber) throw new BadRequestError("Phone number does not exist");
    if(!password) throw new BadRequestError("Password does not exist");

    const admin=await AdminModel.findOne({phoneNumber:phoneNumber});

    if(!admin) throw new BadRequestError("The account you are looking for does not exist");
    
    const match=await admin.verifyPassword(password);

    if(!match) throw new AuthenticationError("Password doesnot match");
    
    res.status(StatusCodes.OK).json({message:"Login successfull", loginStatus:true});
}

module.exports=loginAdmin;