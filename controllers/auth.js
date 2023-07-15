const Students = require("../models/students");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const sendEmail = require("../helpers/email-sender");
const Otp = require("../models/Otp");

const insertStudentRecords = async (req, res) => {
  const record = req.body;
  if (!record || !(record instanceof Array))
    throw new BadRequestError("Invalid Record Format");
  const clear = await Students.deleteMany({});
  const students = await Students.insertMany(record);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    nbCreated: students.length,
    msg: `${students.length} records inserted.`,
  });
};

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new BadRequestError("Please provide email");
  const user = await Students.findOne({ email });
  if (!user)
    throw new BadRequestError("Email doesn't exist. Contact a representative");
  if (user.hasVoted) throw new BadRequestError("You have already voted!");
  const otpCode = Math.floor(Math.random() * 900000) + 100000;
  const expiresIn = new Date().getTime() + 300 * 1000;
  const newOtpDoc = { email, otpCode: otpCode.toString(), expiresIn };
  const alreadyExist = await Otp.findOne({ email });
  if (alreadyExist) {
    alreadyExist.$set("otpCode", otpCode.toString());
    await alreadyExist.save();
  } else {
    const otp = await Otp.create(newOtpDoc);
  }
  await sendEmail({ otpCode, email });
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "A verification code has been sent." });
};

const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email)
    throw new BadRequestError("Must provide verification code and email");
  const token = await Otp.findOne({ email });
  if (!token)
    throw new BadRequestError(
      "Verification failed. Enter your email and retry."
    );
  const { otpCode, expiresIn, tries } = token;
  const timeDifference = expiresIn - new Date().getTime();
  if (timeDifference < 0) {
    await Otp.findOneAndDelete({ email });
    throw new BadRequestError(
      "Token already expired. Please request a new one"
    );
  }
  const otpIsValid = otp === otpCode;
  if (!otpIsValid) {
    if (tries < 2) {
      token.$inc("tries", 1);
      await token.save();
      throw new BadRequestError("Invalid token");
    }
    await Otp.findOneAndDelete({ email });
    throw new BadRequestError(
      "Invalid Token. Maximum tries exceed. Please request a new token."
    );
  }
  await Otp.findOneAndDelete({ email });
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Token valid, please proceed to vote.", success: true });
};

module.exports = { insertStudentRecords, sendVerificationCode, verifyOTP };
