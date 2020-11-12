"use strict";
const express = require("express"),
    app = express();

//Rendering the home page
module.exports =
    app.get("/", (req, res) => {
        let defaultImg = "pictures/default.jpg";
        let defaultCaption = "";
        let defaultAlt = "";

        // //Reading the caption.json file to extract the default caption
        // fs.readFile(pictures + "/captions/caption.json", "utf8", function (err, data) {
        //     if (err) {
        //         return console.log("Error reading file: " + err);
        //     }
        //     //defaultCaption is equal to the default object's caption
        //     defaultCaption = JSON.parse(data).default.caption;

        //Render the index page and pass the variables to the ejs variables
        res.render("base/index", { defaultImg: defaultImg, defaultCaption: defaultCaption, defaultAlt: defaultAlt });
        //});
    });
