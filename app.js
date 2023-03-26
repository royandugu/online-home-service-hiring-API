require("express-async-errors");
require("dotenv").config();

const express=require("express");
const app=express();

//our dependencies
const userRoutes=require("./Routes/userRoutes");
const professionalRoutes= require("./Routes/professionalRoutes")
const requestRoutes= require("./Routes/request")
const errorController=require("./Error_Handlers/errorController");

//middlewares
app.use(express.json());
app.use(errorController);
app.use(express.urlencoded({ extended: true }))
app.use("/api/V1/users",userRoutes);
app.use("/api/V1/professionals",professionalRoutes);
app.use("/api/V1/requests", requestRoutes);


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