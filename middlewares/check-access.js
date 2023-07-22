const { UnauthorizedError } = require("../errors");

const checkAccess = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new UnauthorizedError("Must provide admin access token");
  const token = authHeader.split(" ")[1];
  console.log("token", token);
  const databaseAccessToken = process.env.DATABASE_ACCESS_TOKEN;
  console.log("databasse token", databaseAccessToken);
  if (token !== databaseAccessToken)
    throw new UnauthorizedError("Unauthorized access!");
  next();
};

module.exports = checkAccess;
