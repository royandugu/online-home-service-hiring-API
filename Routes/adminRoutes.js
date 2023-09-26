const Router=require("express").Router();
const {loginAdmin,registerAdmin}=require("../Controllers/adminController")
const {getAllChat}=require("../Controllers/chatController");

Router.route("/register").post(registerAdmin);
Router.route("/login").post(loginAdmin);
Router.route("/chats").get(getAllChat);

module.exports=Router;   // 