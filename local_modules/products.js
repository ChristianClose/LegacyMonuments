"use strict";
// Products Route, used to render and display the products when the user vists /products
const express = require("express"),
    app = express(),
    Product = require("../models/image");

app.set("view engine", "ejs");

module.exports =
    app.get("/products", (req, res) => {
        Product.find({}, (err, images) => {
            if (err) {
                console.log(err);
            } else {
                res.render("products", { images: images });
            }
        });
    });

    app.get("/products/:id", (req, res) => {
        Product.findById(req.params.id, (err, image) => {
            if(err){
                console.log(err);
            } else {
                res.render("products_view", {image: image});
            }
        });
    });