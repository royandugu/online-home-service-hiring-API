const router=require("express").Router();
const {postRequest,manageRequest,feedbackService}=require("../Controllers/service");
router.route("/requestService").post(postRequest);
router.route("/manageService/:requestId/:response").patch(manageRequest);
router.route("/manageFeedback/:requestId").patch(feedbackService);



module.exports=router;
