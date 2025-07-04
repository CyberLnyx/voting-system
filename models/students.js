const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide email"],
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email",
      ],
      unique: true,
      lowercase: true,
    },
    matricNo: {
      type: String,
      required: [true, "Please provide matric number"],
    },
    hasVoted: {
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Students = mongoose.model("Students", StudentSchema);
module.exports = Students;
