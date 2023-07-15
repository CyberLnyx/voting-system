require("express-async-errors");
require("dotenv").config();
const express = require("express");
const connectDB = require("./connections/mongo_db");
const morgan = require("morgan");
const { notFound, methodChecker, errorHandler } = require("./middlewares");
const authRouter = require("./routes/auth");
const votingRouter = require("./routes/voting");
const cors = require("cors");

const PORT = process.env.PORT || 8081;

// initialize an express app
const app = express();

// middlewares

// FOR cross origin request
app.use(
  // cors({
  //   // origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  //   origin: "http://localhost:5173",
  //   credentials: true,
  //   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "UPDATE"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  // })
  cors({
    origin:
      process.env.CORS_ORIGIN ||
      "https://students-week-voting-system.netlify.app/",
    credentials: true,
  })
);
app.set("trust proxy", 1);
// Others
app.use(morgan("tiny")); // log request details
app.use(methodChecker); // checks if the request method is supported
app.use(express.urlencoded({ extended: true })); // parse urlencoded data in request
app.use(express.json()); // parse json data in request
// app.use((req, res, next) => {
//   console.log("Called");
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     process.env.CORS_ORIGIN || "http://localhost:5173"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );

//   next();
// });

// Routing middlewares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resources", votingRouter);

// other middlewares
app.all("*", notFound);
app.use(errorHandler);

/**
 * @summary // connects the server to mongodb and the starts the server on the given port
 */
connectDB(() =>
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  })
);
