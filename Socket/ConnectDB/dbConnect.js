require("dotenv").config();
const Mongoose = require("mongoose");

const connectDb=()=>{    
    return Mongoose.connect(process.env.MONGO_URI);
}

module.exports=connectDb;  