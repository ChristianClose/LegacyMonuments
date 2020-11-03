"use strict";
require('dotenv').config()
const methodOverride = require("method-override"),
    picturesRoute = require("./local_modules/pictures"),
    indexRoute = require("./local_modules/index"),
    express = require("express"),
    passport = require("passport"),
    app = express(),
    appjs = require("./app.js"),
    path = require("path"),
    flash = require("connect-flash"),
    session = require("express-session"),
    mongoose = require("mongoose"),
    MongoStore = require('connect-mongo')(session),
    captions = require("./local_modules/captions"),
    dashboard = require("./local_modules/dashboard"),
    products = require("./local_modules/products"),
    Customer = require("./models/customer"),
    Order = require("./models/order"),
    login = require("./local_modules/login"),
    cluster = require("cluster");

    const cpuCount = require("os").cpus().length;
//Checks if the user is using HTTPS, and if not redirect to HTTPS
function isSecure(req, res, next) {
    if (req.secure) {
        return next();
    };
    res.redirect("https://" + req.hostname + req.url);
}

//Using isSecure middleware to check all requests are using HTTPS
app.all("*", isSecure);

// app.use(session({
//     store: new MongoStore({ mongooseConnection: mongoose.connection})
//     // secret: process.env.SECRET,
//     // name: "sessionId",
//     // resave: false,
//     // saveUninitialized: false,
//     // cookie: { maxAge: 1800000, secure: true, sameSite: true }
// }));

const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;

mongoose.connect("mongodb://" + dbUser + ":" + dbPass + "@localhost/lm?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        if(cluster.worker.id === cpuCount){
            console.log("Connected to DB!")
        }  
    })
    .catch(error => console.log(error.message)
    );

app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    ttl: 1/(24*6) * 24 * 60 * 60, //10 minutes
    secret: process.env.SECRET,
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000, secure: true, sameSite: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.json(), express.urlencoded({ extended: true }));
app.use("/pictures", express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(flash());
app.use(login);
app.use(indexRoute);
app.use(picturesRoute);
app.use(captions.captionsDash);
app.use(captions.captionsEdit);
app.use(captions.captionsUpdate);

app.use(products);
//TODOS
app.get("/pricing", (req, res) => { res.redirect("/"); });
app.get("/checkout", (req, res) => { res.render("checkout"); });
app.post("/checkout", (req, res) => {

    let date = parseInt(new Date().getTime().toString().slice(0, 5));
    let orderNum = Math.floor((Math.random() * date) + 10000);
    var query = {
        email: req.body.customer.email
    }
    let order = JSON.parse(req.body.customer.order);
    var updateCustomer = {
        $setOnInsert: {
            //image in the db will look something like "/pictures/artwork/loki/jpg"
            name: req.body.customer.name,
            phone: req.body.customer.phone,
            address: req.body.customer.address,
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
            Order.findOneAndUpdate({ orderNum: order.orderNum }, updateOrder, { upsert: true })
                .then(res.redirect("/"))
        })
        .catch(error => console.log(error));
})

app.post("/dashboard/markcomplete", (req, res) => {
    console.log(req.body)
    if (req.body) {
        Order.findOneAndUpdate({ orderNum: req.body.orderNum }, { isComplete: req.body.isComplete })
            .then(res.redirect("/dashboard"))
            .catch(error => console.log(error))
    }
})


app.use(dashboard);

app.get("*", (req, res) => {
    res.send("Invalid page request");
});
//Comment


module.exports = app;