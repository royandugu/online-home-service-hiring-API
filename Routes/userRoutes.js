const router=require("express").Router();

const {register,login,editPersonalDetails}=require("../Controllers/userControllers");
const {hiringRequestController}=require("../Controllers/systemControllers");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/editDetails/:id").post(editPersonalDetails);
router.route("/hire/:id").post(hiringRequestController);

module.exports=router;