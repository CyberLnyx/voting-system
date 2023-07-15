const { StatusCodes } = require("http-status-codes");

module.exports = notFound = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  return res
    .status(StatusCodes.NOT_FOUND)
    .send(`${req.url} route does not exist`);
};
