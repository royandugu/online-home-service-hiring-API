const router=require("express").Router();
const {postRequest,manageRequest,feedbackService,getWork,getMyServices, getAllRequests,deleteService}=require("../Controllers/service");

//get work of a professional
router.route("/getWorks/:professionalId").get(getWork); //6NO


router.route("/requestService").post(postRequest); //5NO



router.route("/manageService/:requestId/:response").patch(manageRequest); // 7NO

router.route("/getMyServices/:userId").get(getMyServices); //8NO User ley request gareko service


router.route("/manageFeedback/:requestId").patch(feedbackService); //9NO Give feedback


//For admin
router.route("/getAllRequests").get(getAllRequests);

router.route("/delete/:requestId").delete(deleteService);







module.exports=router;
