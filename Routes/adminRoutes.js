const router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,register,login}=require("../Controllers/adminControllers");
router.route("/sendOtp").post(sendPhoneOtp);
router.route("/validateOtp").post(validatePhoneOtp);
router.route("/register").post(register);
router.route("/login").post(login);
module.exports=router;
