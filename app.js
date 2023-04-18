require("express-async-errors");
require("dotenv").config();

const express=require("express");
const app=express();

//our dependencies
const userRoutes=require("./Routes/userRoutes");
const professionalRoutes= require("./Routes/professionalRoutes")
const errorController=require("./Error_Handlers/errorController");

//middlewares
app.use(express.json());
app.use(errorController);
app.use(express.urlencoded({ extended: true }))
app.use("/api/V1/users",userRoutes);
app.use("/api/V1/professionals",professionalRoutes);

//comment 

const mobEn="mongodb+srv://srojesh69:uxw9c7Uu30eGlfUf@cluster0.1osqdjo.mongodb.net/?retryWrites=true&w=majority";
//User-defined functions
const dbConnector=require("./Connector/dbConnector");
const start=async ()=>{
    try{
        await dbConnector(mobEn);
        app.listen(5000,()=>console.log("Api is listening to port 5000"));
    }
    catch(err){
        console.log(err);
    }
}
start();