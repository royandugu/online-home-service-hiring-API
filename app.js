require("express-async-errors");
require("dotenv").config();

const express=require("express");
const app=express();
const cors=require("cors");

//our dependencies
const adminRoutes=require("./Routes/adminRoutes");
const userRoutes=require("./Routes/userRoutes");
const workerRoutes=require("./Routes/workerRoutes");
const systemRoutes=require("./Routes/systemRoutes");
const khaltiRoute=require("./Routes/Khalti/khalti");
const errorController=require("./Error_Handlers/errorController");

//middlewares
app.use(cors());
app.use(express.json()); 
app.use("/api/V1/admin",adminRoutes);
app.use("/api/V1/users",userRoutes); //https://localhost:5000/api/V1/users/register
app.use("/api/V1/worker",workerRoutes);
app.use("/api/V1/system",systemRoutes);
app.use("/api/V1/payment",khaltiRoute); // api/V1/payment/initiate-payment

app.use(errorController);

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