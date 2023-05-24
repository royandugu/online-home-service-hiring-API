const Router=require("express").Router();
const {getAllChat}=require("../Controllers/chatController");

Router.route("/chats").get(getAllChat);

module.exports=Router;