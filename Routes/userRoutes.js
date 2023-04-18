const router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,updateUser,deleteUser, registerUser, loginUser}=require("../Controllers/userControllers");
const {feedbackService,getMyServices,postRequest}=require("../Controllers/service");
const {getServices,getProfessional}=require("../Controllers/professionalController");
router.route("/sendOtp").post(sendPhoneOtp); //send OTP
router.route("/validateOtp").post(validatePhoneOtp); //validate OTP
router.route("/register").post(registerUser); //user register
router.route("/login").post(loginUser); //user login






router.route("/update/:userId").patch(updateUser); //update user info
router.route("/delete/:userId").delete(deleteUser); //delete user info


//new ones

router.route("/getServices").get(getServices); //get all distinct services 
router.route("/:getProfessional").get(getProfessional); //get professional by service
router.route("/requestService").post(postRequest); //send service request to professional 
router.route("/manageFeedback/:requestId").patch(feedbackService);  // send feedback
router.route("/getMyServices/:userId").get(getMyServices); //get my all services

module.exports=router;
