const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTPPASS,
  },
});

const sendEmail = async ({ otpCode, email }) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Tech-u student week voting",
    text: "An attempt to access the voting system with this email was made.",
    html: `<div style="background-color: rgba(255, 255, 255, 0.9); width: 100%; height: auto; display: flex; justify-content: center; align-items: center;  padding: 15px; box-sizing: border-box;">
        <div style="background-color: transparent;  margin: auto; padding: 32px; box-sizing: border-box;">
            <h1 style="color: #000; text-align: center; margin: 10px 0px">
               Verify your email
            </h1>

            <p style="color:#000; text-align: center;">
                An attempt to access the voting system with this email was made.
                <br/>
                <br />
                If this is not you, ignore this message, otherwise use the code provided below to proceed.
                <br/>
                <br/>
                This verification code will expire in 5 minutes
            </p>

            <h2 style="color: #000; margin: 30px; text-align: center; ">${otpCode}</h2>
        </div>
    </div>`,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      //   return res.json({
      //     message: "An error occured, please try again.",
      //     status: 500,
      //   });
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
      //   return res.json({
      //     message: "OTP sent successfully.",
      //     status: 200,
      //   });
    }
  });
  return;
};

module.exports = sendEmail;
