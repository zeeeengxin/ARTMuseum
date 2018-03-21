var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

// ============
// auth routes
// ============

router.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User( { username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {"error": err.message});
            // solution2:
            // req.flash("error", err.message); 
            // return res.redirect("/register");
            
            // if you use res.render("register"), it will not show the error message
            // it just render the register.ejs page without 
            // utilizing req.flash because it bypass route.get("/register")
            // redirect is making a new request but render is not, render usually keep the old url
            // or you can pass the error in
        }
        passport.authenticate("local")(req, res, function(){ 
            req.flash("success", "Welcome to YelpCamp " + user.username);
            // if register successfully, authenticate/login the user and redirect
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
   res.render("login"); 
});
// handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true, // to pop out error message if login failed
    }), function (req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/campgrounds");
});

module.exports = router;

