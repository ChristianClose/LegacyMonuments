"use strict";
const express = require("express"),
    formidable = require("formidable"),
    app = express(),
    fs = require("fs"),

    Product = require("../../models/image"),
    Order = require("../../models/order"),

    isLoggedIn = require("../../functions/isLoggedIn"),
    storageFunctions = require("../../functions/storageFunctions");

app.set("view engine", "ejs");

module.exports =
    //Render dashboard index page if user is logged in
    app.get("/dashboard", isLoggedIn, (req, res) => {
        Order.find({}).populate("customer")
            .then(orders => res.render("dashboard/dashboard", { orders: orders }))

    });

app.get("/dashboard/products", isLoggedIn, (req, res) => {
    Product.find({}, (err, images) => {
        if (err) {
            console.log(err);
        } else {
            res.render("dashboard/products", { images: images });
        }
    });
});

//Render the page and product the user wamts to edit
app.get("/dashboard/products/:id/edit", isLoggedIn, (req, res) => {
    Product.findById(req.params.id, (err, img) => {
        if (err) {
            console.log(err);
        } else {
            res.render("dashboard/products_edit", { image: img });
        }
    });
});

//Delete the product the user wants to remove
app.delete("/dashboard/products/:id", isLoggedIn, (req, res) => {
    console.log(req.body.deleteName);
    Product.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/dashboard/products");
        }
    });
    //if the image is not a link then delete the image from storage
    if (!req.body.deleteName.includes("http")) {
        var deleteImage = [req.body.deleteName, req.body.deleteCompressed];
        deleteImage.forEach((item) => {
            fs.unlink("./public/" + item, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log(item + " deleted successfully");
                }
            });
        });
    }
});


//Render the new product form
app.get("/dashboard/products/new", isLoggedIn, (req, res) => {
    res.render("dashboard/products_new");
});

//Upload or get the image url and caption then store it in the database and store the uploaded image
app.post("/dashboard/products", isLoggedIn, (req, res) => {
    //get the form items
    var form = new formidable.IncomingForm();
    //parse the request and get the files and submitted fields
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
        } else {
            //if the user uploaded a file then put the file in the pictures/uploaded folder
            if (Object.keys(files).length !== 0) {
                var oldpath = files.imgupload.path;
                var newpath = "./public/pictures/source/uploaded/" + files.imgupload.name;
                fs.rename(oldpath, newpath, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(newpath);
                    }
                });
                fields.image = "/pictures/source/uploaded/" + files.imgupload.name;
                fields.compressedImage = fields.image.replace("source", "compressed");
                storageFunctions.compressImg();
            }
            //upload the image dir and captions to the database
            Product.create(fields, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    setTimeout(() => res.redirect("/dashboard/products"), 50);
                }
            });
        }
    });

});

//Update the information for the particular product
app.put("/dashboard/products/:id", isLoggedIn, (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body.product, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/dashboard/products");
        }
    });
});

app.post("/dashboard/markcomplete", isLoggedIn, (req, res) => {
    console.log(req.body)
    if (req.body) {
        Order.findOneAndUpdate({ orderNum: req.body.orderNum }, { isComplete: req.body.isComplete })
            .then(res.redirect("/dashboard"))
            .catch(error => console.log(error))
    }
})