"use strict";

const fs = require("fs"),
    path = require("path"),
    Product = require("../models/image"),
    compress_images = require("compress-images");

//Used to store the location of each file + the file name (ex. pictures/artwork/abc.jpg)
var imgDir = [];
const imgSource = "public/pictures/source/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,svg,gif}";
const imgOutput = "public/pictures/compressed/";

module.exports.compressImg = function compressImg() {
    compress_images(imgSource, imgOutput, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "8"] } },
        { png: { engine: "webp", command: ["-q", "8"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        (error, completed, statistic) => {
            console.log("---------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("---------------");
        }
    );
};


module.exports.storeImage = function storeImage(picDir) {
    var upsert = { upsert: true };
    imgDir = [];
    imgDir = this.getImageDir();
    var sourceDir = this.getImageDir(false);

    picDir.forEach((dir, index) => {
        var update = {
            $setOnInsert: {
                //image in the db will look something like "/pictures/artwork/loki/jpg"
                image: sourceDir[index],
                compressedImage: imgDir[index]
            }
        };

        if(picDir[0].includes("source")){
            var query = { image: dir};
        } else {
            var query = {compressedImage: dir}
        }


        Product.findOneAndUpdate(query, update, upsert)
            .catch(error => console.error(error));
        //.then(data => console.log(data));
    });
    this.compressImg();
};

module.exports.getImageDir = function getImageDir(compressed = true) {
    let pictures = path.join(__dirname, "../public/pictures/compressed");
    var pictureDir = "/pictures/compressed/";
    //isImg will be used to test to see if a file/directory has an image extension
    let isImg = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i);
    //sets the root directory for the images
    let imgRoot = fs.readdirSync(pictures);
    //Used to store the images files (such as abc.png) in an array
    let imgs = [];
    let picDir = [];

    if (compressed === false) {
        pictureDir = "/pictures/source/";
        pictures = path.join(__dirname, "../public/pictures/source");
        imgRoot = fs.readdirSync(pictures);
    }

    //Looping through each subdirectory of the pictures directory
    imgRoot.forEach((dir) => {
        //Making sure the item is a directory (pictures/folder) and not item (such as abs.jpg)
        if (fs.statSync(pictures + "/" + dir).isDirectory()) {
            //We do not want the captions
            if (dir !== "captions") {
                //If the item is an image (ex. pictures/artwork/abc.jpg is an image but abc.txt is not)
                if (isImg.test(fs.readdirSync(pictures + "/" + dir))) {
                    //Imgs is equal to each image in each subdirectory of pictures/
                    imgs = fs.readdirSync(pictures + "/" + dir);
                    //Setting the directory to each image and storing it in the imgDir array
                    imgs.sort();
                    imgs.forEach((item) => {
                        //add the images locations to the imgDir, which will be used to compare to the images db later
                        picDir.push(pictureDir + dir + "/" + item);
                        //picDir.push("/pictures/compressed/" + dir + "/" + item)
                        picDir.sort();
                    });
                }
            }
        }
    });
    return picDir;
};