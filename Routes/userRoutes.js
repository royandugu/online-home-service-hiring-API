const router=require("express").Router();

const {register,login,editPersonalDetails,getIndvUser,postFeedback}=require("../Controllers/userControllers");
const {hiringRequestController}=require("../Controllers/systemControllers");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/:id").get(getIndvUser);
router.route("/editDetails/:id").post(editPersonalDetails);
router.route("/hire/:id").post(hiringRequestController);
router.route("/feedback").post(postFeedback);

module.exports=router;