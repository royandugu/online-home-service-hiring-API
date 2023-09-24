const { StatusCodes } = require("http-status-codes");
const BadRequestError=require("../Error_Handlers/badRequestError");
const hiringModel=require("../Models/hiringRecords");

const addHiringRecord=async (req,res)=>{
    const {user_id,worker_id,serviceDate}=req.body;
    
    if(!user_id) throw new BadRequestError("User ID is not present");
    if(!worker_id) throw new BadRequestError("Worker ID is not present");
    if(!serviceDate) throw new BadRequestError("Service date is not present");

    const hireRecords=await hiringModel.create({...req.body});
    res.status(StatusCodes.OK).json({hireRecords:hireRecords});
}

const viewHistory=async (req,res)=>{
    const {user_id}=req.params;

    const hireRecords=await hiringModel.find({user_id: user_id});
    res.status(StatusCodes.OK).json({hireRecords:hireRecords});
}
module.exports={addHiringRecord,viewHistory};