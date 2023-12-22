const express = require("express");
const dotenv = require("dotenv");
const router = require("./server/routes/router");
const path = require("path");
const app = express();
const connectDB = require("./server/database/connection");

// Configure dotenv
dotenv.config();
const port = process.env.PORT || 5000;

// set up the template engine
app.set("view engine", "pug");

// register middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use("/", router);
app.use("/css", express.static(path.join(__dirname, "assets/css")));
app.use("/img", express.static(path.join(__dirname, "assets/img")));
app.use("/js", express.static(path.join(__dirname, "assets/client/js")));

const cb = () => {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

connectDB(cb);
