const {
  getContestant,
  submitVote,
  getResult,
  allResult,
} = require("../controllers/voting");
const checkAccess = require("../middlewares/check-access");
const votingRouter = require("express").Router();

votingRouter.route("/get-contestants").get(getContestant);
votingRouter.route("/submit-vote").post(checkAccess, submitVote);
votingRouter.route("/get-result").post(checkAccess, getResult);
votingRouter.route("/results").get(allResult);

module.exports = votingRouter;
