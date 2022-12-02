require("dotenv").config();

const express=require("express");
const app=express();

//middlewares
app.use(express.json());

//User-defined functions
const dbConnector=require("./Connector/dbConnector");
const start=async ()=>{
    try{
        await dbConnector(process.env.MONGO_URI);
        app.listen(5000,()=>console.log("Api is listening to port 5000"));
    }
    catch(err){
        console.log(err);
    }
}
start();