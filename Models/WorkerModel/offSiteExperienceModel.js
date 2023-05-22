require("dotenv").config();

const Mongoose=require("mongoose");

const offSiteExperienceSchema=new Mongoose.Schema({
    workerId:{
        type:Mongoose.Types.ObjectId,
        required:[true, "The experience must belong to a worker"],
    },
    companyName:{
        type:String,
        required:[true, "Please provide your phone number"],
        default:"Self-Employeed"    
    },
    startDate:{
        type:Date,
        required:[true, "The start date for experience must be mentioned"]
    },
    endDate:{
        type:Date,
        required:[true, "The end date for experience must be mentioned"]
    },
    skillsLearned:{
        type:[String],
        required:[true, "Please provide some skills that you have learned"]
    }

})

module.exports=Mongoose.model("OffSiteExperience-Model",offSiteExperienceSchema);