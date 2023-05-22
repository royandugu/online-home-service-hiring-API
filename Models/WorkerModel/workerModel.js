require("dotenv").config();

const Mongoose=require("mongoose");
const {sign}=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const workerSchema=new Mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "Please provide your first name"],
        match:[/^[A-Z][a-z]{2,}$/,"Please provide a valid first name"]
    },
    lastName:{
        type:String,
        required:[true, "Please provide your last name"],
        match:[/^[A-Z][a-z]{2,}$/,"Please provide a valid last name"]
    },
    address:{
        type:String,
        required:[true,"Worker address is required"]
    },
    phoneNumber:{
        type:Number,
        required:[true, "Please provide your phone number"],
        match:[/^[0-9]{10}$/]
    },
    password:{
        type:String,
        match:[/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"Please provide a valid password"],
        required:[true,"Please enter your password"]
    },
    field:{
        type:String,
        required:[true,"Field cannot be left empty"]
    },
    status:{
        type:String,
        enum:["busy","avaliable","idle"],
        required:[true, "Status is necessary"],
        default:"avaliable"
    },
    profilePic:{
        type:String,
        required:[true , "Profile picture is necessary"],
        default:"someUrl"
    },
    workRegistryNumber:{
        type: Number,
        required:[true, "Work registry number is a must"],
    }


})

workerSchema.methods.generateToken=function(){
    return sign({phoneNumber: this.phoneNumber},process.env.JWT_SECRET);
}

workerSchema.methods.verifyPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}


module.exports=Mongoose.model("Worker-Model",workerSchema);