const express = require("express");
const morgan = require("morgan");
const app = express();
const crypto = require("crypto");
const bodyParser = require('body-parser');

const generateRandomKey = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
};

const path = require("path");

const session = require("express-session");

app.set("view engine", "ejs");
app.use( bodyParser.json() );

app.set("views", path.join(__dirname, "views"));

const routesClient = require("./routes/client.routes");

const routesEmployee = require("./routes/employee.routes");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("src"));

app.use("/static", express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "generateRandomKey(64)",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(routesClient);
app.use(routesEmployee);

app.listen(3000);
console.log("Server on port", 3000);
