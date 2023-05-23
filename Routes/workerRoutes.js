const router=require("express").Router();
const {registerWorker,login,editPersonalDetails}=require("../Controllers/workerControllers");
const {getWorkers}=require("../Controllers/systemControllers");
router.route("/").get(getWorkers);
router.route("/register").post(registerWorker);
router.route("/login").post(login); 
router.route("/editDetails/:id").post(editPersonalDetails);
module.exports=router;
