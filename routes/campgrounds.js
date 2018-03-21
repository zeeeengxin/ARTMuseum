var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
// you can just write require("../middleware") because index.js is a special file
// if you just write a folder name, it will automatically require index.js

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) { // pass newCampground here
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds"); // default is the "GET" route
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) { // '/'is very important! don't miss it!
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) { // this should after "/campgrounds/new" because /new also follows this pattern
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    // comments are just object ids, but we want actually info of comments, so populate    
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    }); // if we reach this point, it means we pass the ownership check in middleware
});

// update campground route
router.put("/:id", function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
       if(err) {
           res.redirect("/campgrounds")
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) ;
});

// destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
// add all routes into the router, not directly add to the app
