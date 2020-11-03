"use strict";

const cluster = require("cluster");
const cpuCount = require("os").cpus().length;
if (cluster.isMaster) {
    console.log(cpuCount)
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        cluster.fork();
    })
} else {


    require("dotenv").config();
    const express = require("express");
    const app = express();
    const mongoose = require("mongoose");
    const routes = require("./routes");
    const https = require("https");
    const fs = require("fs");
    const flash = require("connect-flash");
    const session = require("express-session");
    const MongoStore = require("connect-mongo")(session);

    const options = {
        key: fs.readFileSync("key.pem", "utf8"),
        ca: fs.readFileSync("client.csr"),
        cert: fs.readFileSync("cert.pem", "utf8")
    };

    const server = https.createServer(options, app);

    app.use(routes);
    app.set("view engine", "ejs");
    app.enable("trust proxy");

    server.listen(443, () => {
        if(cluster.worker.id === cpuCount){
            console.log("Listening on port 443");
        }
        
    });

    app.listen(80);
}