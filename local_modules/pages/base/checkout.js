const express = require("express"),
    app = express(),
    url = require("url"),

    validateCustomer = require("../../functions/validation.functions").validateCustomer,
    Customer = require("../../models/customer"),
    Order = require("../../models/order");



app.get("/checkout", (req, res) => {
    res.render("base/checkout", { error: req.flash("error") });
});

app.post("/checkout", validateCustomer, (req, res) => {
    createOrderandCust(req.body.customer)
        .then(res.redirect(url.format({
            pathname: "/",
            query: {}
        })))

});


async function createOrderandCust(customer) {
    let date = parseInt(new Date().getTime().toString().slice(0, 5));
    let orderNum = Math.floor((Math.random() * date) + 10000);
    var query = {
        email: customer.email
    }
    let order = JSON.parse(customer.order);
    var updateCustomer = {
        $setOnInsert: {
            //image in the db will look something like "/pictures/artwork/loki/jpg"
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
        },
    };
    order.orderNum = orderNum;
    var updateOrder = {
        $setOnInsert: {
            orderNum: orderNum.toString().trim(),
            isComplete: false,
            items: []
        }
    }
    order.forEach((item, i) => {
        updateOrder.$setOnInsert.items.push(item);
    });
    Customer.findOneAndUpdate(query, updateCustomer, { upsert: true, new: true, select: "_id" })
        .then((customer) => {
            updateOrder.$setOnInsert.customer = customer._id;
            return Order.findOneAndUpdate({ orderNum: order.orderNum }, updateOrder, { upsert: true })
        })
        .catch(error => console.log(error));

}

module.exports = app