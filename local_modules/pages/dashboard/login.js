const passport = require("passport"),
    express = require("express"),
    LocalStraregy = require("passport-local"),
    app = express(),

    User = require("../../models/user");

    passport.use(new LocalStraregy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

module.exports =

app.get("/login", (req, res) => {
    res.render("base/login", { error: req.flash("error") });
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});