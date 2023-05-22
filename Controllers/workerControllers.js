const workerModel=require("../Models/WorkerModel/workerModel");
const {StatusCodes}=require("http-status-codes");

const BadRequestError=require("../Error_Handlers/badRequestError");

const registerWorker = async (req,res) => {
    const {firstName,lastName,phoneNumber,field,address,profilePic,password,workRegistryNumber}=req.body;

    if(!firstName) throw new BadRequestError("First name is not present");
    if(!lastName) throw new BadRequestError("Last name is not present");
    if(!address) throw new BadRequestError("Address is not present");
    if(!password) throw new BadRequestError("Password is not present");
    if(!phoneNumber) throw new BadRequestError("Phone number is not present");
    if(!field) throw new BadRequestError("Filed must be entered");
    if(!workRegistryNumber) throw new BadRequestError("Work registry number must be entered");

    if(!profilePic) profilePic="urlToDefault";

    //Password hashing
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt); 

    req.body.password=hashedPassword;

    const result=await workerModel.create({...req.body});
    return res.status(StatusCodes.CREATED).json({user:result,message:"User created"});        
  
}

const login=async (req,res)=>{
    const {password,phoneNumber}=req.body;

    if(!phoneNumber) throw new BadRequestError("Phone number not provided");
    if(!password) throw new BadRequestError("Password not provided");

    const workerInfo=await workerModel.findOne({phoneNumber:phoneNumber});
    if(!workerInfo) throw new BadRequestError("No user with the provided credentials exist");

    const match=await userInfo.verifyPassword(password);

    if(!match) throw new BadRequestError("Your password does not match");

    if(workerInfo.verified) res.status(StatusCodes.OK).json({message:"User succesfully logged in",loginStatus:true});
}


module.exports = {registerWorker,login};