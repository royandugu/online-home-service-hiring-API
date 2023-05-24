const Router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp}=require("../Controllers/systemControllers");
const {createChat,getSpecificChat}=require("../Controllers/chatController");

Router.route("/sendOtp").post(sendPhoneOtp);
Router.route("/validateOtp").post(validatePhoneOtp);
Router.route("/chat").get(getSpecificChat).post(createChat);
module.exports=Router;