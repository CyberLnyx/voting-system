const VoteDb = require("../model/model");

const addVote = (req, res) => {
  const data = req.body;
  const newVote = new VoteDb({ ...data });
  newVote
    .save(newVote)
    .then((data) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ success: false });
    });
};

const findUser = async (value) => {
  try {
    const vote = await VoteDb.findOne({ voterMatricNo: value });
    return vote;
  } catch (error) {
    return error;
  }
};

module.exports = { addVote, findUser };
