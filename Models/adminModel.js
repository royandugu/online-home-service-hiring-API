const Mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const adminSchema=new Mongoose.Schema({
    firstName:{
        type:String,
        required:[true , "Admin first name is required"]
    },
    lastName:{
        type:String,
        required:[true , "Admin last name is required"]
    },
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