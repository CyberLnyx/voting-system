const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  voterMatricNo: String,
  "most-expensive-male": String,
  "most-popular-female": String,
  "most-influential-female": String,
  "best-dressed-male": String,
  "most-influential-male": String,
  "fashionista-female": String,
  "brand-of-the-year": String,
  "entrepreneur-of-the-year": String,
  "sportswoman-of-the-year": String,
  "media-personality-of-the-year": String,
  "student-of-the-year": String,
  "fresher-of-the-year": String,
  "best-dressed-female": String,
  "most-expensive-female": String,
  "artiste-of-the-year": String,
  "most-sophisticated-male": String,
  "most-popular-male": String,
  "sportsman-of-the-year": String,
});

const voteDb = mongoose.model("newvotes", schema);

module.exports = voteDb;
