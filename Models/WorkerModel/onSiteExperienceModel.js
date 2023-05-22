require("dotenv").config();

const Mongoose=require("mongoose");

const onSiteExperienceSchema=new Mongoose.Schema({
    workerId:{
        type:Mongoose.Types.ObjectId,
        required:[true, "The experience must belong to a worker"],
    },
    review:{
        type:[{user_id: Mongoose.Types.ObjectId , review: String}]
    },
    startDate:{
        type:Date,
        required:[true, "The start date for experience must be mentioned"]
    },
    endDate:{
        type:Date,
        required:[true, "The end date for experience must be mentioned"]
    },
    skillsAcquired:{
        type:[String],
        required:[true, "Please provide some skills that you have learned"]
    }
})

module.exports=Mongoose.model("OnSiteExperience-Model",onSiteExperienceSchema);