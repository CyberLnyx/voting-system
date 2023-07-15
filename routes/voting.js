const { getContestant, submitVote } = require("../controllers/voting");
const checkAccess = require("../middlewares/check-access");
const votingRouter = require("express").Router();

votingRouter.route("/get-contestants").get(getContestant);
votingRouter.route("/submit-vote").post(checkAccess, submitVote);

module.exports = votingRouter;
