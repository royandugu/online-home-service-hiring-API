//Other dependencies
require("dotenv").config();


const serivceModel=require("../Models/request");




//Two validators
const postRequest=async (req,res)=>{
    const {...serviceDetail}=req.body;
    const service = await serivceModel.create(serviceDetail);
    res.send(service)
    
}

//Register
const manageRequest =async (req,res)=>{
  const requestId = req.params.requestId;
  const response = req.params.response;
  const responseI = {
    isAccepted:response
  }
 

  const set = await serivceModel.findByIdAndUpdate(requestId,responseI)
  res.send(set)



 
}


// const getRequest =async (req,res)=>{
//   const professionalId = req.params.professionalId;


//   const set = await serivceModel.findById(professionalId)
//   res.send(set)



 
// }

//Login

  


module.exports={postRequest,manageRequest,getRequest};

//find

