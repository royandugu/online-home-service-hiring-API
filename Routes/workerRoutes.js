const router=require("express").Router();
const {registerWorker,login,editPersonalDetails,getIndvWorker, getSearchWorker, getIndvWorkerByContact,addWorkerReview,getWorkerCategory,getWorkerRequests}=require("../Controllers/workerControllers");
const {getWorkers,hireConfirmationController}=require("../Controllers/systemControllers");

router.route("/").get(getWorkers);
router.route("/category").get(getWorkerCategory); 
router.route("/search").get(getSearchWorker);
router.route("/byContact/:phoneNumber").get(getIndvWorkerByContact)
router.route("/workerRequests/:workerId").get(getWorkerRequests);
router.route("/:id").get(getIndvWorker); 
router.route("/register").post(registerWorker);
router.route("/login").post(login); 
router.route("/editDetails/:id").post(editPersonalDetails);
router.route("/acceptHire").post(hireConfirmationController);
router.route("/review").post(addWorkerReview);

module.exports=router;
