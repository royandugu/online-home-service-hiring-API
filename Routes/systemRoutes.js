const Router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp}=require("../Controllers/systemControllers");
Router.route("/sendOtp").post(sendPhoneOtp);
Router.route("/validateOtp").post(validatePhoneOtp);
module.exports=Router;