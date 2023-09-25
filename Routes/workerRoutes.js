const router=require("express").Router();
const {registerWorker,login,editPersonalDetails,getIndvWorker, getSearchWorker,addWorkerReview,getWorkerCategory}=require("../Controllers/workerControllers");
const {getWorkers,hireConfirmationController}=require("../Controllers/systemControllers");

router.route("/").get(getWorkers);
router.route("/category").get(getWorkerCategory); ///category
router.route("/search").get(getSearchWorker);
router.route("/:id").get(getIndvWorker); 
router.route("/register").post(registerWorker);
router.route("/login").post(login); 
router.route("/editDetails/:id").post(editPersonalDetails);
router.route("/acceptHire").post(hireConfirmationController);
router.route("/review").post(addWorkerReview);

module.exports=router;
