const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

const Vote = mongoose.model("Votes", VoteSchema);
module.exports = Vote;
