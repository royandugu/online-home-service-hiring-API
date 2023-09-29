const Router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,getTotalUsers,getTotalWorkers,getUsers}=require("../Controllers/systemControllers");
const {createChat,getSpecificChat}=require("../Controllers/chatController");

Router.route("/sendOtp").post(sendPhoneOtp);
Router.route("/sendPhone")
Router.route("/validateOtp").post(validatePhoneOtp);
Router.route("/usersNumber").get(getTotalUsers);
Router.route("/workersNumber").get(getTotalWorkers);
Router.route("/users").get(getUsers);

Router.route("/chat").get(getSpecificChat).post(createChat);
module.exports=Router;  