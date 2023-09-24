const Router=require("express").Router();
const {viewHistory,addHiringRecord}=require("../Controllers/hireController");

Router.route("/").post(addHiringRecord);
Router.route("/:user_id").get(viewHistory);

module.exports=Router;  