const router=require("express").Router();
const {registerWorker,login,editPersonalDetails}=require("../Controllers/workerControllers");
const {getWorkers,hireConfirmationController}=require("../Controllers/systemControllers");
router.route("/").get(getWorkers); 
router.route("/register").post(registerWorker);
router.route("/login").post(login); 
router.route("/editDetails/:id").post(editPersonalDetails);
router.route("/acceptHire").post(hireConfirmationController);
module.exports=router;
