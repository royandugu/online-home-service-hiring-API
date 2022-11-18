const express=require("express");
const app=express();

const start=async ()=>{
    try{
        //Connect to the db
        app.listen(5000,()=>console.log("Api is listening to port 5000"));
    }
    catch(err){
        console.log(err);
    }
}
start();