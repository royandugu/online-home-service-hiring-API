const Mongoose=require("mongoose");
const Schema=new Mongoose.Schema({
    phoneNumber:{
        type:Number,
        required:[true, "Please provide your phone number"],
        minlength:10,
        maxlength:10
    }
})

module.exports=Mongoose.model("Phone-Number-Model",Schema);