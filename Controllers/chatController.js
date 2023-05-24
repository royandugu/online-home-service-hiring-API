const ChatModel=require("../Models/chatModel");
const BadRequestError=require("../Error_Handlers/badRequestError");

const {StatusCodes}=require("http-status-codes");

const createChat=async (req,res)=>{
    const {user_id , worker_id , sender_id , reciever_id , data}=req.body;

    if(!user_id) throw new BadRequestError("User Id is not present");
    if(!worker_id) throw new BadRequestError("Worker Id is not present");

    if(sender_id !== user_id && sender_id !== worker_id) throw new BadRequestError("Sender is neither the user nor worker");
    if(reciever_id !== user_id && reciever_id !== worker_id) throw new BadRequestError("Sender is neither user nor worker");

    const format={sender_id:sender_id,reciever_id:reciever_id,data:data,date:new Date()};
    const chatHistory=await ChatModel.findOne({user_id: user_id , worker_id: worker_id});

    if(!chatHistory){
        const queryObject={};
        
        queryObject.user_id=user_id;
        queryObject.worker_id=worker_id;
        queryObject.messages=format;

        const newChat=await ChatModel.create({...queryObject});
        res.status(StatusCodes.CREATED).json({message:"Chat initialized" , newChat:newChat});
    }
    else{
        console.log("Else part running");
        chatHistory.messages=[...chatHistory.messages, format];
        await chatHistory.save();
        res.status(StatusCodes.OK).json({message:"Chat added", recentChat: format});
    }

}   

const getAllChat=async (req,res)=>{
    const allChats=await ChatModel.find({});
    res.status(StatusCodes.OK).json({message: "Chats fetched" , allChats:allChats});
}

const getSpecificChat=async (req,res)=>{
    const {user_id, worker_id}=req.query;
    
    if(!user_id && !worker_id) throw new BadRequestError("Required parameters are not present");

    const queryObject={};
    
    if(user_id) queryObject.user_id=user_id;
    if(worker_id) queryObject.worker_id=worker_id;

    const chatHistory=await ChatModel.find(queryObject);

    res.status(StatusCodes.OK).json({message:"Specific chat fetched", chatHistory:chatHistory})

}

module.exports={createChat , getAllChat , getSpecificChat};