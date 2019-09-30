const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const User = require("../models/users");
var passport = require("passport");

router.get("/register", (req, res, next) => {
    res.render("../views/auth/register");
});

router.post("/register", (req, res, next) => {
    User.register(new User({
            _id: Math.random()
            .toString(36)
            .substr(2, 9),
            username: req.body.username
        }),
        req.body.password,
        function (err, user) {
            if(err){
                console.log(err);
                return res.render("../views/auth/register");
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
        });
    });
});

router.get("/login", (req, res, next) => {
    res.render("../views/auth/login");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login"
}) ,function(req, res){
});


router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("login");
});

module.exports = router;

