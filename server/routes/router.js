const router = require("express").Router();
// const allUsers = require("../constants/fake");
// const allUsers = require("../constants/newData");
const { addVote } = require("../controllers/controller");
const { homeRoute, userValid } = require("../services/render");

/**
 * @description request to home route
 * @method GET
 */
router.get("/", homeRoute);

router.post("/vote", userValid);

router.post("/vote/validate", addVote);

module.exports = router;
