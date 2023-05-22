const workerModel=require("../Models/WorkerModel/workerModel");
const {StatusCodes}=require("http-status-codes");

const bcrypt=require("bcryptjs");

const BadRequestError=require("../Error_Handlers/badRequestError");

const registerWorker = async (req,res) => {
    const {firstName,lastName,phoneNumber,field,address,password,workRegistryNumber}=req.body;

    if(!firstName) throw new BadRequestError("First name is not present");
    if(!lastName) throw new BadRequestError("Last name is not present");
    if(!address) throw new BadRequestError("Address is not present");
    if(!password) throw new BadRequestError("Password is not present");
    if(!phoneNumber) throw new BadRequestError("Phone number is not present");
    if(!field) throw new BadRequestError("Filed must be entered");
    if(!workRegistryNumber) throw new BadRequestError("Work registry number must be entered");

    //Password hashing
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt); 

    req.body.password=hashedPassword;

    const result=await workerModel.create({...req.body});
    return res.status(StatusCodes.CREATED).json({expert:result,message:"Expert created"});        
  
}

const login=async (req,res)=>{
    const {password,phoneNumber}=req.body;

    if(!phoneNumber) throw new BadRequestError("Phone number not provided");
    if(!password) throw new BadRequestError("Password not provided");

    const workerInfo=await workerModel.findOne({phoneNumber:phoneNumber});
    if(!workerInfo) throw new BadRequestError("No user with the provided credentials exist");

    const match=await workerInfo.verifyPassword(password);

    if(!match) throw new BadRequestError("Your password does not match");

    res.status(StatusCodes.OK).json({message:"User succesfully logged in",loginStatus:true});

}

const editPersonalDetails=async (req,res)=>{
    const {id}=req.params;
    const {firstName,lastName,phoneNumber,field,address,password,workRegistryNumber,profilePic,status}=req.body;
    const queryObject={};

    if(firstName) queryObject.firstName=firstName;
    if(lastName) queryObject.lastName=lastName;
    if(phoneNumber) queryObject.phoneNumber=phoneNumber;
    if(address) queryObject.address=address;
    if(profilePic) queryObject.profilePic=profilePic;
    if(password) queryObject.password=password;
    if(field) queryObject.field=field;
    if(status) queryObject.status=status;
    if(workRegistryNumber) queryObject.workRegistryNumber=workRegistryNumber;

    try{
        const newDetails=await workerModel.findOneAndUpdate({_id:id},{...queryObject},{new:true,  runValidators:true});
        res.status(StatusCodes.OK).json({newDetails:newDetails,message:"Update succesfull"});
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err});   
    }
}


module.exports = {registerWorker,login,editPersonalDetails};