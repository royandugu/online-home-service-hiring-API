const Router=require("express").Router();
const loginAdmin=require("../Controllers/adminController")
const {getAllChat}=require("../Controllers/chatController");

Router.route("/login").post(loginAdmin);
Router.route("/chats").get(getAllChat);

module.exports=Router;