"use strict";
require('dotenv').config()
const methodOverride = require("method-override"),
    picturesRoute = require("./local_modules/pictures"),
    indexRoute = require("./local_modules/index"),
    express = require("express"),
    passport = require("passport"),
    app = express(),
    path = require("path"),
    flash = require("connect-flash"),
    captions = require("./local_modules/captions"),
    dashboard = require("./local_modules/dashboard"),
    products = require("./local_modules/products"),
    login = require("./local_modules/login");

//Checks if the user is using HTTPS, and if not redirect to HTTPS
function isSecure(req, res, next){
    if(req.secure){
        return next();
    };
    res.redirect("https://" + req.hostname + req.url );
}

//Using isSecure middleware to check all requests are using HTTPS
app.all("*", isSecure);

app.use(require("express-session")({
    secret: process.env.SECRET,
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000, secure: true, sameSite: true}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/pictures", express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

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

app.use(dashboard);

app.get("*", (req, res) => {
    res.send("Invalid page request");
});
//Comment


module.exports = app;