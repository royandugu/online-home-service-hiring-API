const router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,register,login,getProfessional, updateProfessional, deleteProfessional}=require("../Controllers/professionalController");
router.route("/sendOtp").post(sendPhoneOtp);
router.route("/validateOtp").post(validatePhoneOtp);
router.route("/register").post(register);
router.route("/login").post(login);



router.route("/getServices").get(login); // 3

router.route("/:getProfessional").get(getProfessional); //get professional from here not request.js  4


//What admin can do

router.route("/getAllProfessionals").get(updateProfessional);
router.route("/update/:professionalId").patch(updateProfessional);
router.route("/delete/:professionalId").delete(deleteProfessional);
module.exports=router;
