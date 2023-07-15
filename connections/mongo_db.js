const mongoose = require("mongoose");

module.exports = connectDB = async (callback) => {
  try {
    let connectionString = process.env.MONGODB_CONNECTION_STRING.replace(
      "<password>",
      process.env.DATABASE_ACCESS_PASSWORD
    );
    const con = await mongoose.connect(connectionString);
    console.log(`MongoDB connected:${con.connection.host}`);
    callback();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
