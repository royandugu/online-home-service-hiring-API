const router=require("express").Router();
const {sendPhoneOtp,validatePhoneOtp,registerAdmin,loginAdmin}=require("../Controllers/adminControllers");
const {updateUser,deleteUser}=require("../Controllers/userControllers");
const {updateProfessional, deleteProfessional}=require("../Controllers/professionalController");
const {getAllRequests,deleteService}=require("../Controllers/service");

router.route("/sendOtp").post(sendPhoneOtp);
router.route("/validateOtp").post(validatePhoneOtp);
router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);

//new routes
router.route("/getAllUsers").get(updateUser);  
router.route("/update/:userId").patch(updateUser);
router.route("/delete/:userId").delete(deleteUser);

router.route("/getAllUsers").get(updateUser);  
router.route("/update/:userId").patch(updateUser);
router.route("/delete/:userId").delete(deleteUser);


router.route("/getAllRequests").get(getAllRequests);
router.route("/delete/:requestId").delete(deleteService);


router.route("/getAllProfessionals").get(updateProfessional);
router.route("/update/:professionalId").patch(updateProfessional);
router.route("/delete/:professionalId").delete(deleteProfessional);

module.exports=router;
