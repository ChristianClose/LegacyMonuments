//Used to create the Images Schema and model for the DB
const mongoose = require("mongoose");

var Product;
var imageSchema = new mongoose.Schema({
    image: String,
    compressedImage: {type: String, default: ""},
    caption: { type: String, default: "" },
    price: { type: Number, default: null},
    description: {type: "String", default: ""}
}),
Product = mongoose.model("Image", imageSchema);
module.exports = Product;