// const allUsers = require("../constants/fake");
const allUsers = require("../constants/NEWDATABASE");
const CATEGORIES = require("../constants/nominee");
const { findUser } = require("../controllers/controller");

const homeRoute = (req, res) => {
  const valid = req.query.valid;
  const hasvoted = req.query.hasvoted;
  if (valid === "false") {
    return res.render("index", { invalid: "false" });
  }
  if (hasvoted === "true") {
    return res.render("index", { hasVoted: "false" });
  }
  res.render("index");
};

const userValid = async (req, res) => {
  // const userValid = allUsers.find(
  //   (user) =>
  //     user.matricNo === req.body.matric_no &&
  //     user.surname.toLowerCase() === req.body.surname.toLowerCase()
  // );
  if (!req.body.email) {
    res.redirect("?valid=false");
  }
  const userValid = allUsers.find((user) => user.email === req.body.email);
  if (!userValid) {
    res.redirect("/?valid=false");
  } else {
    const matricNo = userValid.matricNo;
    let vote = await findUser(matricNo);
    if (vote === null) {
      res.render("vote", { userValid, CATEGORIES });
    } else {
      res.redirect("/?hasvoted=true");
    }
  }
};

module.exports = { homeRoute, userValid };
