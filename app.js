"use strict";

const cluster = require("cluster");
const cpuCount = require("os").cpus().length;

if (cluster.isMaster) {

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        cluster.fork();
    })

} else {


    require("dotenv").config();
    const express = require("express");
    const routes = require("./routes");
    const https = require("https");
    const fs = require("fs");
    const app = express();

    const options = {
        key: fs.readFileSync("./https_keys/key.pem", "utf8"),
        ca: fs.readFileSync("./https_keys/client.csr"),
        cert: fs.readFileSync("./https_keys/cert.pem", "utf8")
    };

    const server = https.createServer(options, app);

    app.use(routes);
    app.set("view engine", "ejs");
    app.enable("trust proxy");

    server.listen(443, () => {
        if (cluster.worker.id === cpuCount) {
            console.log("Listening on port 443");
        }

    });

    app.listen(80);
}