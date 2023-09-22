require("dotenv").config();

const express=require("express");
const app=express();
const http=require("http");
const {Server}=require("socket.io");

const cors=require("cors");
app.use(cors());

const server=http.createServer(app);

const connectDb=require("./ConnectDB/dbConnect");

const io = new Server(server , {
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on("send_message",(data)=>{
        console.log(data);
        const listenSendMessage = async () => {
            try {
                await connectDb();
                //const chat=await createChat(data);
                socket.emit("message_saved",chat); 
            }
            catch (err) {
                console.error(err);
            }
        }
        listenSendMessage();
    });
})

server.listen(3001, async ()=>{
    console.log("Socket is running on port 3001")
})