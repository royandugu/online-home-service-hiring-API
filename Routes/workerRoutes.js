const router=require("express").Router();
const {registerWorker,login}=require("../Controllers/workerControllers");
router.route("/register").post(registerWorker);
router.route("/login").post(login);
module.exports=router;
