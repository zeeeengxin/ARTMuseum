var express 	= require("express"),
	router		= express.Router(),
	passport 	= require("passport"),
	User 		= require("../models/user");

// landing page
router.get("/", function(req, res) {
	res.render("landing");
});

// auth routes:
// register page
router.get("/register", function(req, res) {
	res.render("register", {page: 'register'});
});
// register logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to ARTMuseum " + user.username + "!");
			res.redirect("/art_museum/museums");
		});
	});
});

// show login form
router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
});
// handle the login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/art_museum/museums",
		failureRedirect: "/art_museum/login",
		successFlash: "Welcome back!",
		failureFlash: true
	}), function (req, res) {
});

// log out route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged out successfully");
	res.redirect("/art_museum/museums");
});

module.exports = router;