"use strict";
const express = require("express"),
    app = express(),
    Product = require("../../models/image");
    app.set("view engine", "ejs");

exports.captionsDash = 
    app.get("/dashboard/captions", (req, res) => {
        Product.find({}, (err, images) => {
            if (err) {
                console.log(err);
            } else {
                res.render("test", { images: images });
            }
        });
    });

exports.captionsEdit = 
    app.get("/dashboard/captions/:id/edit", (req, res) => {
        Product.findById(req.params.id, (err, img) => {
            if (err) {
                console.log(err);
            } else {
                res.render("captionform", { image: img });
            }
        });
    });

exports.captionsUpdate = 
    app.put("/dashboard/captions/:id", (req, res) => {
        var update = {
            $set: {
                caption: req.body.caption
            }
        };

        console.log(req);
        Product.findByIdAndUpdate(req.params.id, update, { upsert: true })
            .then(() => res.redirect("/dashboard/captions/"))
            .catch(error => console.log(error));
    });