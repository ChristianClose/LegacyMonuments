"use strict";
/*Getting the required modules to run the site*/
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./routes");
const https = require("https");
const fs = require("fs");

const options = {
    key: fs.readFileSync("key.pem", "utf8"),
    ca: fs.readFileSync("client.csr"),
    cert: fs.readFileSync("cert.pem", "utf8")
};

const server = https.createServer(options, app);
const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;

console.log(console.log("mongodb://" + dbUser + ":" + dbPass + "@localhost/lm?authSource=admin"))


app.use(routes);
app.set("view engine", "ejs");
app.enable("trust proxy");

mongoose.connect("mongodb://" + dbUser + ":" + dbPass + "@localhost/lm?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("Connected to DB!"))
    .catch(error => console.log(error.message)
);

server.listen(443, () => {
    console.log("Listening on port 443");
});

app.listen(80);