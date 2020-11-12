//Used to create the Images Schema and model for the DB
const mongoose = require("mongoose");

var Order;
var orderSchema = new mongoose.Schema({
        orderNum: {type: String, default: ""},
        customer: {type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
        items: {
            id: {type: String, default: ""},
            name: {type: String, default: ""},
            price: {type: String, default: ""}
        },
        isComplete: {type: Boolean, default: false} 
});
Order = mongoose.model("Order", orderSchema);
module.exports = Order;