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



  


module.exports={postRequest,manageRequest,feedbackService};


