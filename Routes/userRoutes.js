const router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,register,login,updateUser,deleteUser}=require("../Controllers/userControllers");
router.route("/sendOtp").post(sendPhoneOtp);
router.route("/validateOtp").post(validatePhoneOtp);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update/:userId").patch(updateUser);
router.route("/delete/:userId").delete(deleteUser);
module.exports=router;
