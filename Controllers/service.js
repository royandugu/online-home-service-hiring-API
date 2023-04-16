//Other dependencies
require("dotenv").config();


const serivceModel=require("../Models/request");




//Two validators
const postRequest=async (req,res)=>{
  try {
    const {...serviceDetail}=req.body;
    const service = await serivceModel.create(serviceDetail);
    res.send(service)
    
  } catch (error) {
    res.send(error)
  }

}


const manageRequest =async (req,res)=>{
  const requestId = req.params.requestId;
  const response = req.params.response;
  const responseI = {
    isAccepted:response
  }
 try {
    
  const set = await serivceModel.findByIdAndUpdate(requestId,responseI)
  res.send(set)
 } catch (error) {
    res.send(error)
 }




 
}



const feedbackService =async (req,res)=>{
  try {
    const requestId = req.params.requestId;
    const response = req.params.response;
    const responseI = {
      feedback:response
    }
   
  
    const set = await serivceModel.findByIdAndUpdate(requestId,responseI)
    res.send(set)
  
  } catch (error) {
    res.send(error)
  }



 
}




const getWork =async (req,res)=>{
  const professionalId = req.params.prfessionalId
 
  try {
     
   const set = await serivceModel.find({professionalId: professionalId}).exec()
   res.send(set)
  } catch (error) {
     res.send(error)
  }
 }
  

 const getMyServices =async (req,res)=>{
  const userId = req.params.requestId;
  

 try {
    
  const set = await serivceModel.find({userId:userId});
  res.send(set)
 } catch (error) {
    res.send(error)
 }
}

const getAllRequests =async (req,res)=>{
 
  try {
     
   const set = await serivceModel.find()
   res.send(set)
  } catch (error) {
     res.send(error)
  }
 }



const deleteService= async(req,res)=>{
  const userId = req.params.userId
  try {
      const resposne  = await serivceModel.findByIdAndDelete(userId)
      return resposne
  } catch (error) {
      return error
  }

}


module.exports={postRequest,manageRequest,feedbackService,getAllRequests,getWork,getMyServices,deleteService};


