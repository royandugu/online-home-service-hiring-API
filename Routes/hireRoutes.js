const Router=require("express").Router();
const {viewHistory,addHiringRecord,workCompleted,settleCompleted,allHiringRecords,getWorkerHireRequests,addServiceCost}=require("../Controllers/hireController");

Router.route("/").get(allHiringRecords).post(addHiringRecord);

Router.route("/addService/:record_id").patch(addServiceCost);
Router.route("/:user_id").get(viewHistory);

Router.route("/work_completed/:record_id").patch(workCompleted);
Router.route("/hireRequest/:worker_id").get(getWorkerHireRequests)
Router.route("/settled/:record_id").patch(settleCompleted);

module.exports=Router;  