const router=require("express").Router();
const {registerWorker,login,editPersonalDetails}=require("../Controllers/workerControllers");
router.route("/register").post(registerWorker);
router.route("/login").post(login); 
router.route("/editDetails/:id").post(editPersonalDetails);
module.exports=router;
