const router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,registerProfessional,loginProfessional,getProfessional, updateProfessional, deleteProfessional}=require("../Controllers/professionalController");
const {manageRequest,getWork}=require("../Controllers/service");

router.route("/sendOtp").post(sendPhoneOtp);
router.route("/validateOtp").post(validatePhoneOtp);
router.route("/register").post(registerProfessional);
router.route("/login").post(loginProfessional);


router.route("/update/:professionalId").patch(updateProfessional);
router.route("/delete/:professionalId").delete(deleteProfessional);


router.route("/getWorks/:professionalId").get(getWork); //get works assigned to the worker
router.route("/manageService/:requestId/:response").patch(manageRequest); //accept or reject 



module.exports=router;
