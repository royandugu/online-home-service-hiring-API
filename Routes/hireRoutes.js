const Router=require("express").Router();
const {viewHistory,addHiringRecord,workCompleted,settleCompleted,allHiringRecords}=require("../Controllers/hireController");

Router.route("/").get(allHiringRecords).post(addHiringRecord);
Router.route("/:user_id").get(viewHistory);

Router.route("/work_completed/:record_id").patch(workCompleted);
Router.route("/settled/:record_id").patch(settleCompleted);

module.exports=Router;  