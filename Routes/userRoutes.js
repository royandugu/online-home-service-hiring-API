const router=require("express").Router();
const {register,login,editPersonalDetails}=require("../Controllers/userControllers");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/editDetails/:id").post(editPersonalDetails);
module.exports=router;