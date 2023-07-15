const { StatusCodes } = require("http-status-codes");

module.exports = methodChecker = (req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
  if (!allowedMethods.includes(req.method))
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ msg: `${req.method} method not allowed.` });
  next();
};
