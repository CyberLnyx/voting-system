const CustomError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

module.exports = errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError)
    return res
      .status(err.statusCode)
      .json({ status: err.statusCode, msg: err.message, success: false });
  return res.status(err?.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: err?.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err?.message || "An error occured, please try again",
    success: false,
    err,
  });
};
