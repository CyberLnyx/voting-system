const {
  insertStudentRecords,
  sendVerificationCode,
  verifyOTP,
} = require("../controllers/auth");
const authRouter = require("express").Router();
const checkAccess = require("../middlewares/check-access");

authRouter.route("/add-students").post(checkAccess, insertStudentRecords);
authRouter.route("/send-verification").post(sendVerificationCode);
authRouter.route("/verify-otp").post(verifyOTP);

module.exports = authRouter;
