//Used to create the Images Schema and model for the DB
const mongoose = require("mongoose");

var Customer;
var customerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String,  required: true},
    phone: { type: Number, required: true},
    address: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
    }
})

Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;