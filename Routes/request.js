const router=require("express").Router();
const {postRequest,manageRequest,getRequest}=require("../Controllers/service");
router.route("/requestService").post(postRequest);
router.route("/manageService/:requestId/:response").post(manageRequest);
router.route("/getService/:professionalId").post(getRequest);

module.exports=router;
