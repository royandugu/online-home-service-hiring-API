require("dotenv").config();

const Mongoose=require("mongoose");
const {sign}=require("jsonwebtoken");


const ProffesionalSchema=new Mongoose.Schema({
    phoneNumber:{
        type:Number,
        required:[true, "Please provide your phone number"],
        match:[/^[0-9]{10}$/]
    },
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
    email:{
        type:String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email',],
        unique: true,
    },
    password:{
        type:String,
        match:[/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"Please provide a valid password"],
        required:[true,"Please enter your password"]
    },
    profession:{
        type:String,
        match:[/^[A-Z][a-z]{2,}$/,"Please provide a valid "],
        required:[true,"Please enter your password"]
    }
})

ProffesionalSchema.methods.generateToken=function(){
    return sign({phoneNumber: this.phoneNumber},process.env.JWT_SECRET);
}

module.exports=Mongoose.model("Professional-Model",ProffesionalSchema);