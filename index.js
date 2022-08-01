const express = require("express");
require("@prisma/client");
require("dotenv").config();
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
global.__basedir = __dirname;

app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());

//import router
const routes = require("./route");

// ROUTE
app.use("/", routes);

const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
