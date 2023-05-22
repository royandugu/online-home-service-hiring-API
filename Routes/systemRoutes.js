const Router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,getWorkers}=require("../Controllers/systemControllers");
Router.route("/sendOtp").post(sendPhoneOtp);
Router.route("/validateOtp").post(validatePhoneOtp);
Router.route("/getWorkers").get(getWorkers);
module.exports=Router;