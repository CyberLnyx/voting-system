const { StatusCodes } = require("http-status-codes");
const contestants = require("../constants/nassa-contestants.json");
const { BadRequestError, UnauthorizedError } = require("../errors");
const Students = require("../models/students");
const Vote = require("../models/votes");

const getContestant = async (req, res) => {
  return res.status(StatusCodes.OK).json({ success: true, data: contestants });
};

const submitVote = async (req, res) => {
  const { data, email } = req.body;
  if (!data || !email) throw new BadRequestError("Can't submit votes");
  const student = await Students.findOne({
    email: { $regex: email, $options: "i" },
  });
  if (!student) throw new UnauthorizedError("Unauthorized student");
  if (student.hasVoted) throw new UnauthorizedError("You have already voted!");
  const voteExist = await Vote.findOne({ voteBy: email });
  if (voteExist) throw new UnauthorizedError("You have already voted!");
  student.hasVoted = true;
  await student.save();
  let vote = await Vote.create({ ...data, voteBy: email });
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "Vote Submitted Successfully!✅✅" });
};

const getResult = async (req, res) => {
  const data = req.body;
  const matches = await Vote.find(data);
  return res.status(200).json({ data, nbHits: matches.length });
};

const allResult = async (req, res) => {
  let data = await Vote.find({});
  return res.status(200).json({ success: true, data: data, contestants });
};

module.exports = { getContestant, submitVote, getResult, allResult };
