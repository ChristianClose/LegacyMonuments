"use strict";
require('dotenv').config()
const methodOverride = require("method-override"),
    cluster = require("cluster"),
    express = require("express"),
    passport = require("passport"),
    path = require("path"),
    flash = require("connect-flash"),
    session = require("express-session"),
    mongoose = require("mongoose"),
    MongoStore = require('connect-mongo')(session),
    app = express(),

    //appjs = require("./app.js"),

    picturesRoute = require("./local_modules/pages/base/pictures"),
    indexRoute = require("./local_modules/pages/base/index"),
    products = require("./local_modules/pages/base/products"),
    checkout = require("./local_modules/pages/base/checkout"),

    dashboard = require("./local_modules/pages/dashboard/dashboard"),
    login = require("./local_modules/pages/dashboard/login");


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
app.use(checkout);

app.use(products);
//TODOS
app.get("/pricing", (req, res) => { res.redirect("/"); });



app.use(dashboard);

app.get("*", (req, res) => {
    res.send("Invalid page request");
});
//Comment


module.exports = app;