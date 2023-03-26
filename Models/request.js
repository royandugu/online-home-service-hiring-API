require("dotenv").config();

const Mongoose=require("mongoose");



const RequestSchema=new Mongoose.Schema({
    professionalId:{
        type: Mongoose.Schema.ObjectId,
        ref:'Professional-Model',
        required: [true,"Professional ID cant be blank"]
    },
    userId:{
        type: Mongoose.Schema.ObjectId,
        ref:'User-Model',
        required: [true,"Professional ID cant be blanlk"]
    },
    date:{
        type:String
    },
    isAccepted:{
        type:Boolean,
    },
    price:{
        type:Number,
        required:true,
    }
    
    
})



module.exports=Mongoose.model("RequestSchema",RequestSchema);