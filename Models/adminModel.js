const Mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const adminSchema=new Mongoose.Schema({
    phoneNumber:{
        type: Number,
        required:[true , "Phone number is required"]
    },
    password:{
        type: String,
        match:[/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"Please provide a valid password"],
        required:[true , "Password is required"]
    }
},{timestamps:true})

adminSchema.methods.verifyPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

module.exports=Mongoose.model("admin-model",adminSchema);