const { check, validationResult } = require('express-validator');

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

async function validateCustomer(req, res, next) {
    await check("customer[name]").not().isEmpty().isLength({ min: 3 }).escape().withMessage("Name must have more than 3 characters").run(req),
        await check("customer[email]", "The email you entered is not valid").not().isEmpty().isEmail().normalizeEmail().run(req)
    await check("customer[phone]", "The phone number entered is not valid").not().isEmpty().isMobilePhone("en-US").escape().run(req)

    const result = validationResult(req)
    if (!result.isEmpty()) {
        req.flash("error", result.errors[0].msg)
        res.redirect("/checkout");
    } else {
        return next();
    }
}

module.exports = {isLoggedIn, validateCustomer};