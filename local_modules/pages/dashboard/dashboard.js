"use strict";
const express = require("express"),
    formidable = require("formidable"),
    app = express(),
    fs = require("fs").promises,

    Product = require("../../models/image"),
    Order = require("../../models/order"),

    isLoggedIn = require("../../functions/validation.functions").isLoggedIn,
    storageFunctions = require("../../functions/storage.functions");

app.set("view engine", "ejs");

module.exports =
    //Render dashboard index page if user is logged in
    //INDEX
    app.get("/dashboard", isLoggedIn, (req, res) => {
        Order.find({}).populate("customer")
            .then(orders => res.render("dashboard/dashboard", { orders: orders }))

    });

//PRODUCTS INDEX
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
//SHOW
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
//DESTROY
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
            fs.unlink("./public/" + item)
                .then(item + " deleted successfully")
                .catch(error => console.log(error))
        });
    }
});


//Render the new product form
app.get("/dashboard/products/new", isLoggedIn, (req, res) => {
    res.render("dashboard/products_new");
});

//Upload or get the image url and caption then store it in the database and store the uploaded image
app.post("/dashboard/products", [isLoggedIn, parseForm], (req, res) => {
    res.redirect("/dashboard/products");
});

//Update the information for the particular product
//UPDATE
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

async function parseForm(req, body, next) {
    //get the form items
    var form = new formidable.IncomingForm();
    //parse the request and get the files and submitted fields
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
        } else {
            // //if the user uploaded a file then put the file in the pictures/uploaded folder
            if (Object.keys(files).length !== 0) {
                var oldpath = files.imgupload.path;
                var newpath = "./public/pictures/source/uploads/" + files.imgupload.name;
                uploadImage(oldpath, newpath);
            }

            fields.image = "/pictures/source/uploads/" + files.imgupload.name;

            fields.compressedImage = "/pictures/compressed/uploads/" + files.imgupload.name;
            storageFunctions.compressImg();
            //fields.compressedImage = fields.image.replace("source", "compressed");
            //upload the image dir and captions to the database
            Product.create(fields)
                .then(next())
                .catch(error => console.log(error))
        }
    })
}


async function uploadImage(path, newpath) {
    await fs.readFile(path)
        .then(data => {
            fs.writeFile(newpath, data)
                .then(console.log("File uploaded successfully"))
                .catch(error => console.log(error))
        })
}
