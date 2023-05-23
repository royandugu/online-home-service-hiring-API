const Router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,hiringRequestController}=require("../Controllers/systemControllers");
Router.route("/sendOtp").post(sendPhoneOtp);
Router.route("/validateOtp").post(validatePhoneOtp);
Router.route("/hire/:id").get(hiringRequestController);

module.exports=Router;