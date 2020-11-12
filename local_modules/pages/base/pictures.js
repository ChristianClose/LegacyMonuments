"use strict";

const e = require("express");

const express = require("express"),
    app = express(),
    Product = require("../../models/image");

module.exports =
    app.get("/pictures", findImage, (req, res) => {

       let images = req.body.imageObj.images;
         //send the images object to the client to be processed and used for the slideshow
        res.send(images);
    });

function findImage(req, res, next) {
    var thisimage = { compressedImage: "asc" };
    //ImgDb is an empty array because we want to use it to store just the images directories
    var imgDb = [];

    if (req.query.compressed === "false") {
        thisimage = { image: "asc" };
    }

    /*Getting all the images and their properties from the database, then sorting by the image dir in ascending order
    then using .exec to execute the query*/
    Product.find({}).sort(thisimage).exec((err, images) => {
        if (err) {
            console.log(err);
        } else {
            //Looping through the images object to get each subobjects image property, then storing it in the imgDB array
            images.forEach((item) => {
                if (req.query.compressed === "" || req.query.compressed === undefined || req.query.compressed === "true") {
                    imgDb.push(item.compressedImage)
                } else {
                    imgDb.push(item.image);
                }
            });
            req.body.imageObj = { images : images.sort(), imgDb: imgDb };
        }
        return next();
    });

}

    /* Unused for now until I can figure out how to properly implement this.
    // May cause issues if web Admin manually deletes images from the directory instead of deleting through the dashboard */
//  function deleteUnmatchedImage(req, res, next) {
//     //Filtering the imgDB array to get only the items that do not match both the local dir and the database
//     let imgDb = imgStorage.getImgDb();
//     let imgDir = imgStorage.getImageDir();
//     //let result = imgDb.filter(array1 => !imgDir.some(array2 => array1 == array2));
//     console.log(imgDb)
//     //req.body.imgDb = imgDb;

//     return next();

//     // //if the local directory does not match the database
//     // if (imgDir !== imgDb) {
//     //     imgStorage.storeImage(imgDir);
//     //     //loop through each item that does not match
//     //     if (imgDir !== imgDb) {
//     //         console.log("_______________________________")
//     //         console.log(imgDir)
//     //         console.log("_-----------------------------")
//     //         console.log(imgDb)
//     //         result.forEach((item) => {
//     //             //if the result that does not match is not local, I.E. is an external link (which would have http included in the url), then do not continue
//     //             if (item && !item.includes("http")) {
//     //                 if (req.query.compressed === "false") {
//     //                     query = { image: item }
//     //                 } else {
//     //                     query = { compressedImage: item }
//     //                 }

//     //                 console.log(query)
//     //                 //Otherwise delete the item from the database
//     //                 Product.deleteOne(query, (err, success) => {
//     //                     if (err) {
//     //                         console.log(err);
//     //                     } else {
//     //                         console.log(success);
//     //                     }
//     //                 });
//     //             }
//     //         });
//     //     }
//     // }
// }