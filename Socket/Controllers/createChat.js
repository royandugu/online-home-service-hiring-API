const ChatModel=require("../../API/Models/SystemModels/ChatModel/chatModel");
const BadRequestError = require("../../API/Error_Handlers/badRequestError");

const createChat=async (details)=>{
    const {adminId , organizerId , sender_id , reciever_id , data}=details;

    if(!adminId) throw new BadRequestError("Admin ID is not present")
    if(!organizerId) throw new BadRequestError("Organizer id is not present")
    if(!sender_id) throw new BadRequestError("User Id is not present");
    if(!reciever_id) throw new BadRequestError("Worker Id is not present");
    if(!data) throw new BadRequestError("Data is not present");

    if(sender_id !== adminId && sender_id !== organizerId) throw new BadRequestError("Sender is neither the user nor worker");
    if(reciever_id !== adminId && reciever_id !== organizerId) throw new BadRequestError("Sender is neither user nor worker");

    const format={sender_id:sender_id,reciever_id:reciever_id,data:data,sentDate:new Date()};
    const chatHistory=await ChatModel.findOne({adminId: adminId , organizerId: organizerId});

    if(!chatHistory){
        const queryObject={};
        
        queryObject.adminId=adminId;
        queryObject.organizerId=organizerId;
        queryObject.messages=format;

        const newChat=await ChatModel.create({...queryObject});
        return newChat;
    }
    else{
        chatHistory.messages=[...chatHistory.messages, format];
        await chatHistory.save();
        return format;
    }
}   

module.exports={createChat};