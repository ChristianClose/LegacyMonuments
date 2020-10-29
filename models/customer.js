//Used to create the Images Schema and model for the DB
const mongoose = require("mongoose");

var Customer;
var customerSchema = new mongoose.Schema({
    name: {type: String, default: ""},
    email: { type: String, default: "" },
    phone: { type: Number, default: null},
    address: {
        street: {type: String, default: ""},
        city: {type: String, default: ""},
        state: {type: String, default: ""},
    }
})

Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;