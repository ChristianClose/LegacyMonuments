const express = require("express"),
    app = express(),
    url = require("url"),

    { check, validationResult } = require('express-validator'),
    Customer = require("../../models/customer"),
    Order = require("../../models/order");


module.exports =

    app.get("/checkout", (req, res) => {
        res.render("base/checkout", { error: req.flash("error") });
    });

app.post("/checkout", [
    validateCustomer,
    async (req, res, next) => {
        //console.log(req)
        await check("customer[name]").not().isEmpty().isLength({ min: 3 }).escape().withMessage("Name must have more than 3 characters").run(req),
        await check("customer[email]", "The email you entered is not valid").not().isEmpty().isEmail().normalizeEmail().run(req)
        await check ("customer[phone]", "Your phone number entered is not valid").not().isEmpty().isMobilePhone("en-US").escape().run(req)

        const result = validationResult(req)
        if(!result.isEmpty()){
            req.flash("error", result.errors[0].msg)
            res.redirect("/checkout");
        } else {
            return next();
        }
    }
], (req, res) => {
    createOrderandCust(req.body.customer)
        .then(res.redirect(url.format({
            pathname: "/",
            query: {}
        })))

});

function validateCustomer(req, res, next) {
    for (let info in req.body.customer) {
        if (!req.body.customer[info]) {
            let error = "Please enter your " + info;
            res.redirect(url.format({
                pathname: "/checkout",
                query: {
                    error: error
                }
            }));
            return false;
        }
    }

    return next();
}

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